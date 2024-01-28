import { ConfigurationService } from '@configuration/configuration.service'
import { IDataServices } from '@core/abstracts'
import { IInMemoryDataServices } from '@core/abstracts/in-memory-data-services.abstract'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { TAccessTokenPayload } from '@core/type/token/access-token-payload.type'
import { TRefreshTokenPayload } from '@core/type/token/refresh-token-payload.type'
import { TYPE_SOURCE_REFRESH_TOKEN } from '@frameworks/data-servies/mongodb/constant/refresh-token.constant'
import { PREFIX_KEY_REDIS } from '@frameworks/in-memory-data-services/redis/constant/key.constant'
import { plainToClass } from '@nestjs/class-transformer'
import { validate } from '@nestjs/class-validator'
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenUsecase } from '@use-cases/refresh-token/refresh-token.use-case'
import { AccessTokenPayloadDto } from '@use-cases/token/dto/access-token-payload.dto'
import { CreateRefreshTokenDto } from '@use-cases/token/dto/create-refresh-token.dto'
import { RefreshTokenPayloadDto } from '@use-cases/token/dto/refresh-token-payload.dto'
import { TokenResponseDto } from '@use-cases/token/dto/token-response.dto'
import { UserDeviceUseCase } from '@use-cases/user-device/user-device.user-case'
import { OAuth2Client } from 'google-auth-library'
import { nanoid } from 'nanoid'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'
import { TOKEN_TYPE } from './constant/token.constant'

@Injectable()
export class TokenUsecase {
  constructor(
    private readonly logger: ILoggerService,
    private readonly inMemoryDataService: IInMemoryDataServices,
    private readonly dataService: IDataServices,
    private readonly refreshTokenUsecase: RefreshTokenUsecase,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigurationService,
  ) {
    this.logger.setContext(TokenUsecase.name)
  }

  public async generateTokenManualLogin({
    isOnboardPending,
    device_id,
    user_id,
    phone_number,
    email,
    country_code,
  }: {
    isOnboardPending: boolean
    device_id?: string
    user_id: string
    phone_number: string
    email: string
    country_code: string
    device_name?: string
    coordinations?: number[]
  }): Promise<TokenResponseDto> {
    const isNewDevice = !device_id
    const new_device_id = isNewDevice ? nanoid() : device_id
    const accessTokenPayload: TAccessTokenPayload = {
      phone_number,
      country_code,
      user_id,
      device_id: new_device_id,
      type_token: isOnboardPending ? TOKEN_TYPE.ACCESS_TOKEN_ONBOARD : TOKEN_TYPE.ACCESS_TOKEN,
    }
    const refreshTokenPayload: TRefreshTokenPayload = {
      device_id: new_device_id,
      type_token: isOnboardPending ? TOKEN_TYPE.REFRESH_TOKEN_ONBOARD : TOKEN_TYPE.REFRESH_TOKEN,
    }
    if (!isOnboardPending) {
      accessTokenPayload.email = email
      refreshTokenPayload.email = email
    }

    const { token: access_token } = this.generateAccessToken(accessTokenPayload)
    const { token: refresh_token, expire_at: refresh_token_expire_at } =
      this.generateRefreshToken(refreshTokenPayload)

    await this.saveRefreshTokenToMainDb({
      refresh_token,
      device_id: new_device_id,
      expire_at: refresh_token_expire_at,
      type_source_refresh_token: TYPE_SOURCE_REFRESH_TOKEN.MANUAL,
    })
    await this.dataService.accessToken.create({
      access_token: access_token,
      created_at: getCurrentMilisecondTime(),
      device_id: new_device_id,
    })
    await this.createWhitelistToken({ accessToken: access_token, deviceId: new_device_id })

    return { access_token, refresh_token, device_id: new_device_id }
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
    refresh_token: string
    device_id: string
  }) {
    const deviceIdKey = this.getAccessTokenKey(device_id)
    const access_token = await this.inMemoryDataService.getKey(deviceIdKey)
    await Promise.all([
      this.inMemoryDataService.deleteKey(deviceIdKey),
      this.refreshTokenUsecase.deleteByFilter({ refresh_token, device_id }),
      this.dataService.accessToken.deleteByField({ access_token, device_id }),
    ])
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
      console.log(access_token, payload)
      const errors = await validate(payloadInstance)
      if (
        errors.length ||
        (payload.type_token !== TOKEN_TYPE.ACCESS_TOKEN &&
          payload.type_token !== TOKEN_TYPE.ACCESS_TOKEN_ONBOARD)
      ) {
        console.log(errors)
        throw new UnauthorizedException()
      }

      return payload
    } catch (error) {
      console.log(error)
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

  public async verifyGoogleOauthRefreshToken(
    refresh_token: string,
  ): Promise<{ access_token: string; refresh_token: string; email: string }> {
    const clientId: string = this.configService.get('google.client_id')
    const clientSecret: string = this.configService.get('google.client_secret')
    const googleClient = new OAuth2Client(clientId, clientSecret)
    googleClient.setCredentials({ refresh_token })
    const res = await googleClient.refreshAccessToken()
    const accessTokenPayload = await googleClient.getTokenInfo(res.credentials.access_token)
    const data = {
      access_token: res.credentials.access_token,
      refresh_token: res.credentials.refresh_token,
      email: accessTokenPayload.email,
    }
    return data
  }

  public getAccessTokenKey(device_id: string): string {
    return `${PREFIX_KEY_REDIS.DEVICE_ID}${device_id}`
  }

  public async verifyWhitelistToken(device_id: string, access_token: string) {
    const accessTokenKey = this.getAccessTokenKey(device_id)
    const value = await this.inMemoryDataService.getKey(accessTokenKey)

    if(!value){
      const token = await this.dataService.accessToken.getOne({access_token, device_id})
      if(!token){
        throw new UnauthorizedException()
      }
    }
    if (value !== access_token) {
      throw new UnauthorizedException()
    }
  }
}
