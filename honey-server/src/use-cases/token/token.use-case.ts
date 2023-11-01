import { ConfigurationService } from '@configuration/configuration.service'
import { IInMemoryDataServices } from '@core/abstracts/in-memory-data-services.abstract'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { AccessTokenPayloadDto } from '@core/dtos/token/access-token-payload.dto'
import { CreateRefreshTokenDto } from '@core/dtos/token/create-refresh-token.dto'
import { RefreshTokenPayloadDto } from '@core/dtos/token/refresh-token-payload.dto'
import { TokenResponseDto } from '@core/dtos/token/token-response.dto'
import { TAccessTokenPayload } from '@core/type/token/access-token-payload.type'
import { TRefreshTokenPayload } from '@core/type/token/refresh-token-payload.type'
import { plainToClass } from '@nestjs/class-transformer'
import { validate } from '@nestjs/class-validator'
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenUsecase } from '@use-cases/refresh-token/refresh-token.use-case'
import { UserDeviceUseCase } from '@use-cases/user-device/user-device.user-case'
import { Types } from 'mongoose'
import { nanoid } from 'nanoid'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'
import { PREFIX_DEVICE_ID, TOKEN_TYPE } from './constant/token.constant'

@Injectable()
export class TokenUsecase {
  constructor(
    private readonly logger: ILoggerService,
    private inMemoryDataService: IInMemoryDataServices,
    private readonly refreshTokenUsecase: RefreshTokenUsecase,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigurationService,
    private readonly userDeviceUsecase: UserDeviceUseCase,
  ) {
    this.logger.setContext(TokenUsecase.name)
  }

  public async generateTokenManualLogin({
    device_id,
    user_id,
    phone_number,
    email,
    country_code,
  }: {
    device_id?: string
    user_id: Types.ObjectId
    phone_number: string
    email: string
    country_code: string
  }): Promise<TokenResponseDto> {
    const isNewDevice = !device_id
    const new_device_id = isNewDevice ? nanoid() : device_id
    const accessTokenPayload: TAccessTokenPayload = {
      phone_number,
      email,
      country_code,
      user_id,
      device_id: new_device_id,
      type_token: TOKEN_TYPE.ACCESS_TOKEN,
    }
    const refreshTokenPayload: TRefreshTokenPayload = {
      device_id: new_device_id,
      type_token: TOKEN_TYPE.REFRESH_TOKEN,
      email,
    }

    if (isNewDevice) {
      await this.userDeviceUsecase.createUserDevice({ device_id: new_device_id, user_id })
    }

    const { token: access_token } = this.generateAccessToken(accessTokenPayload)
    const { token: refresh_token, expire_at: refresh_token_expire_at } =
      this.generateRefreshToken(refreshTokenPayload)

    await this.saveRefreshTokenToMainDb({
      refresh_token,
      device_id: new_device_id,
      expire_at: refresh_token_expire_at,
    })
    await this.createWhitelistToken({ accessToken: access_token, deviceId: new_device_id })

    return { access_token, refresh_token }
  }

  public async saveRefreshTokenToMainDb(dto: CreateRefreshTokenDto) {
    this.logger.debug({ dto }, 'saveRefreshTokenToMainDb')
    await this.refreshTokenUsecase.create(dto)
  }

  public async createWhitelistToken({
    accessToken,
    deviceId,
  }: {
    accessToken: string
    deviceId: string
  }) {
    this.logger.debug({ accessToken, deviceId }, 'createWhitelistToken')
    const deviceIdKey = this.getAccessTokenKey(deviceId)
    await this.inMemoryDataService.setKey(deviceIdKey, accessToken)
  }

  public async revokeToken({
    refresh_token,
    device_id,
  }: {
    refresh_token?: string
    device_id: string
  }) {
    const deviceIdKey = this.getAccessTokenKey(device_id)
    await this.inMemoryDataService.deleteKey(deviceIdKey)
    if (refresh_token) {
      await this.refreshTokenUsecase.deleteByFilter({ refresh_token, device_id })
    }
  }

  public generateAccessToken(payload: TAccessTokenPayload): { token: string; expire_at: number } {
    const expireTime = +this.configService.get('jwt.access_token_expire_time')
    const expiresIn = expireTime + getCurrentMilisecondTime()
    const token = this.jwtService.sign(payload, {
      algorithm: this.configService.get('jwt.algorithm'),
      expiresIn,
    })

    return { token, expire_at: expiresIn }
  }

  public generateRefreshToken(payload: TRefreshTokenPayload): { token: string; expire_at: number } {
    const expireTime = +this.configService.get('jwt.refresh_token_expire_time')
    const expiresIn = expireTime + getCurrentMilisecondTime()
    const token = this.jwtService.sign(payload, {
      algorithm: this.configService.get('jwt.algorithm'),
      expiresIn,
    })

    return { token, expire_at: expiresIn }
  }

  public async verifyAccessToken(access_token: string): Promise<AccessTokenPayloadDto> {
    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenPayloadDto>(access_token)
      const payloadInstance = plainToClass(AccessTokenPayloadDto, payload)
      const errors = await validate(payloadInstance)
      if (errors.length || payload.type_token !== TOKEN_TYPE.ACCESS_TOKEN) {
        throw new UnauthorizedException()
      }

      return payload
    } catch (error) {
      throw new UnauthorizedException()
    }
  }

  public async verifyRefreshToken(refresh_token: string): Promise<RefreshTokenPayloadDto> {
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayloadDto>(refresh_token)
      const payloadInstance = plainToClass(RefreshTokenPayloadDto, payload)
      const errors = await validate(payloadInstance)
      if (errors.length || payload.type_token !== TOKEN_TYPE.REFRESH_TOKEN) {
        throw new BadRequestException('type token is not correct!')
      }

      return payload
    } catch (error) {
      throw new BadRequestException('token is not correct!')
    }
  }

  public getAccessTokenKey(device_id: string): string {
    return `${PREFIX_DEVICE_ID}${device_id}`
  }

  public async verifyWhitelistToken(device_id: string, access_token: string) {
    const accessTokenKey = this.getAccessTokenKey(device_id)
    const value = await this.inMemoryDataService.getKey(accessTokenKey)

    if (value !== access_token) {
      throw new UnauthorizedException()
    }
  }
}
