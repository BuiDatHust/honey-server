import { ConfigurationService } from '@configuration/configuration.service'
import { IDataServices } from '@core/abstracts'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { UpdateUserOnboardingDto } from '@core/dtos/user/update-user-onboarding.dto'
import { OTP_USECASE, TYPE_OTP } from '@frameworks/data-servies/mongodb/constant/otp.constant'
import { SESSION_HISTORY_TYPE } from '@frameworks/data-servies/mongodb/constant/session-history.constant'
import { USER_STATUS } from '@frameworks/data-servies/mongodb/constant/user.constant'
import { BadRequestException, Injectable } from '@nestjs/common'
import { AccountSettingUserUseCase } from '@use-cases/account-setting-user/account-setting-user.user-case'
import { CreateAccountSettingDto } from '@use-cases/account-setting-user/dto/create-account-setting.dto'
import { CreateNotificationSettingDto } from '@use-cases/notification-setting-user/dto/create-notification-setting.dto'
import { NotificationSettingUserUsecase } from '@use-cases/notification-setting-user/notification-setting-user.use-case'
import { VerifyOtpDto } from '@use-cases/otp/dto/verify-otp.dto'
import { OtpUseCase } from '@use-cases/otp/otp.use-case'
import { RefreshTokenUsecase } from '@use-cases/refresh-token/refresh-token.use-case'
import { CreateSearchSettingDto } from '@use-cases/search-setting-user/dto/create-search-setting.dto'
import { SearchSettingUserUsecase } from '@use-cases/search-setting-user/search-setting-user.use-case'
import { TokenResponseDto } from '@use-cases/token/dto/token-response.dto'
import { TokenUsecase } from '@use-cases/token/token.use-case'
import { UserDeviceUseCase } from '@use-cases/user-device/user-device.user-case'
import { UserUsecase } from '@use-cases/user/user.use-case'
import * as clm from 'country-locale-map'
import { OAuth2Client } from 'google-auth-library'
import { Types } from 'mongoose'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'
import { getPhoneWithCountryCode } from 'src/helpers/phone.helper'
import { LOG_OUT_TYPE } from './constant/auth.constant'
import { LoginThroughGoogleRequestDto } from './dto/login-through-google-request.dto'
import { ManualLoginRequestDto } from './dto/manual-login-request.dto'
import { ManualRegisterRequestDto } from './dto/manual-register-request.dto'
import { OnboardRequestDto } from './dto/on-board-request.dto'

@Injectable()
export class AuthUseCase {
  constructor(
    private readonly logger: ILoggerService,
    private readonly configService: ConfigurationService,
    private readonly otpUsecase: OtpUseCase,
    private readonly userUseCase: UserUsecase,
    private readonly searchSettingUsecase: SearchSettingUserUsecase,
    private readonly notificationSettingUsecase: NotificationSettingUserUsecase,
    private readonly accountSettingUsecase: AccountSettingUserUseCase,
    private readonly tokenUsecase: TokenUsecase,
    private readonly refreshTokenUsecase: RefreshTokenUsecase,
    private readonly userDeviceUsercase: UserDeviceUseCase,
    private readonly dataServices: IDataServices,
  ) {
    this.logger.setContext(AuthUseCase.name)
  }

  public async manualRegister(dto: ManualRegisterRequestDto) {
    this.logger.debug({ dto }, 'manualRegister')
    const { phone_number, country_code, code } = dto
    const existedUser = await this.userUseCase.getOne({ phone_number, country_code })

    if (existedUser?.status === USER_STATUS.BANNED) {
      throw new BadRequestException('User is banned!')
    }
    if (existedUser?.status === USER_STATUS.ONBOARD_PENDING) {
      throw new BadRequestException('User is onboard pending!')
    }

    const verificationData: VerifyOtpDto = {
      phone: getPhoneWithCountryCode(phone_number, country_code),
      type_otp: TYPE_OTP.PHONE,
      code,
      otp_usecase: OTP_USECASE.REGISTER_ACCOUNT,
    }
    const isVerified = await this.otpUsecase.verifyOtp(verificationData)
    if (isVerified) {
      const attribute = { phone_number, country_code }
      await this.userUseCase.createUser(attribute)
    }

    return isVerified
  }

  public async handleOnBoard(dto: OnboardRequestDto, phone_number: string, country_code: string) {
    this.logger.debug({ dto }, 'handleOnBoard')

    const existedUser = await this.userUseCase.getOne({ phone_number, country_code })
    if (!existedUser) {
      throw new BadRequestException('User not found!')
    }
    if (existedUser.status !== USER_STATUS.ONBOARD_PENDING) {
      throw new BadRequestException('User is not in onboarding pending!')
    }

    const accountSettingAttribute: CreateAccountSettingDto = {
      user_id: existedUser._id,
      language: clm.getLocaleByNumeric(country_code),
    }
    const searchSetttingAttribute: CreateSearchSettingDto = { user_id: existedUser._id }
    const notificationSettingAttribute: CreateNotificationSettingDto = {
      user_id: existedUser._id,
      email_setting: {},
      push_notification_setting: {},
    }
    if (dto.is_show_notification) {
      notificationSettingAttribute.push_notification_setting = {
        is_send_new_match: true,
        is_send_new_message: true,
        is_send_message_like: true,
      }
    }
    const [accountSetting, searchSetting, notificationSetting] = await Promise.all([
      this.accountSettingUsecase.createAccountSetting(accountSettingAttribute),
      this.searchSettingUsecase.createSearchSetting(searchSetttingAttribute),
      this.notificationSettingUsecase.createNotificationSetting(notificationSettingAttribute),
    ])

    const updateUseAttribute: UpdateUserOnboardingDto = {
      ...dto,
      id: existedUser._id,
      status: USER_STATUS.ACTIVE,
      account_setting: accountSetting._id,
      notification_setting: notificationSetting._id,
      search_setting: searchSetting._id,
    }
    await this.userUseCase.updateUserOnboard(updateUseAttribute)
  }

  public async manualLogin(dto: ManualLoginRequestDto): Promise<TokenResponseDto> {
    const { phone_number, country_code, code } = dto
    const phone = getPhoneWithCountryCode(phone_number, country_code)
    const verifyData: VerifyOtpDto = {
      phone,
      type_otp: TYPE_OTP.PHONE,
      otp_usecase: OTP_USECASE.MANUAL_LOGIN_ACCOUNT,
      code,
    }
    const isVerified = await this.otpUsecase.verifyOtp(verifyData)
    if (!isVerified) {
      throw new BadRequestException('verify code is not correct!')
    }

    const existedUser = await this.userUseCase.getOne({
      phone_number,
      country_code,
      status: { $nin: [USER_STATUS.BANNED, USER_STATUS.DELETED] },
    })
    if (!existedUser) {
      console.log(isVerified)
      throw new BadRequestException('User is not exist!')
    }

    // case login with old device
    if (dto.device_id) {
      await this.validateDevice(existedUser._id, dto.device_id)
    }

    const tokenData = await this.tokenUsecase.generateTokenManualLogin({
      isOnboardPending: existedUser.status === USER_STATUS.ONBOARD_PENDING,
      user_id: existedUser._id,
      phone_number,
      email: existedUser.email,
      device_name: dto.device_name,
      country_code,
      device_id: dto.device_id,
    })
    if (!dto.device_id) {
      await this.userDeviceUsercase.createUserDevice({
        device_id: tokenData.device_id,
        device_name: dto.device_name,
        user_id: existedUser._id,
      })
    }
    await this.dataServices.sessionHistory.create({
      type_session_history: SESSION_HISTORY_TYPE.MANUAL,
      user_id: existedUser._id,
      user_device_id: tokenData.device_id,
      coordinations: dto.coordinations,
      created_at: getCurrentMilisecondTime(),
    })
    return tokenData
  }

  public async loginThroughGoogle(dto: LoginThroughGoogleRequestDto): Promise<TokenResponseDto> {
    const clientId: string = this.configService.get('google.client_id')
    const clientSecret: string = this.configService.get('google.client_secret')
    const googleClient = new OAuth2Client(clientId, clientSecret)

    let token
    let isAuthoCodeVerified = true
    try {
      token = await googleClient.getToken(dto.authorization_code)
    } catch (error) {
      this.logger.error({ error }, 'getToken')
      isAuthoCodeVerified = false
    }
    if (!isAuthoCodeVerified) {
      throw new BadRequestException('Authorization code is not correct!')
    }

    const { refresh_token, access_token } = token.tokens
    if (!refresh_token && !access_token) {
      throw new BadRequestException('Authorize code is not correct!')
    }
    const payload = await googleClient.getTokenInfo(access_token)
    const email = payload.email
    if (!email) {
      throw new BadRequestException('Authorization code is not correct!')
    }
    const user = await this.dataServices.users.getOne({
      email,
      status: { $in: [USER_STATUS.ACTIVE, USER_STATUS.HIDE] },
    })
    if (!user) {
      throw new BadRequestException('This email not exist in system!')
    }

    if (dto.device_id) {
      await this.validateDevice(user._id, dto.device_id)
    }

    const tokenData = await this.tokenUsecase.generateTokenManualLogin({
      isOnboardPending: false,
      device_id: dto.device_id,
      phone_number: user.phone_number,
      country_code: user.country_code,
      email: user.email,
      coordinations: dto.coordinations,
      user_id: user._id,
      device_name: dto.device_name,
    })
    await this.dataServices.sessionHistory.create({
      type_session_history: SESSION_HISTORY_TYPE.GOOGLE_OAUTH,
      user_id: user._id,
      user_device_id: tokenData.device_id,
      coordinations: dto.coordinations,
      created_at: getCurrentMilisecondTime(),
    })
    return { access_token, refresh_token, device_id: tokenData.device_id }
  }

  public async logout(logout_type: string, device_id: string) {
    if (logout_type === LOG_OUT_TYPE.SPECIFIC) {
      const currentTime = getCurrentMilisecondTime()
      const currentRefreshToken = await this.refreshTokenUsecase.getOneByFilter({
        device_id,
        expire_at: { $gt: currentTime },
      })

      await this.tokenUsecase.revokeToken({
        refresh_token: currentRefreshToken.refresh_token,
        device_id,
      })
    }
  }

  public async renewToken(refresh_token: string): Promise<TokenResponseDto> {
    return this.renewManualToken(refresh_token)
  }

  public async renewManualToken(refresh_token: string): Promise<TokenResponseDto> {
    const payload = await this.tokenUsecase.verifyRefreshToken(refresh_token)
    const device_id = payload.device_id

    await this.tokenUsecase.revokeToken({
      refresh_token,
      device_id,
    })

    const user = await this.userUseCase.getOne({
      email: payload.email,
      status: { $in: [USER_STATUS.ACTIVE, USER_STATUS.HIDE] },
    })
    if (!user) {
      throw new BadRequestException('Not exist user!')
    }
    const tokenData = await this.tokenUsecase.generateTokenManualLogin({
      isOnboardPending: user.status === USER_STATUS.ONBOARD_PENDING,
      user_id: user._id,
      phone_number: user.phone_number,
      country_code: user.country_code,
      email: user.email,
      device_id,
    })
    return tokenData
  }

  async validateDevice(user_id: string, device_id: string) {
    const existedUserDevice = await this.userDeviceUsercase.getUserDeviceByFilter({
      // user_id: new Types.ObjectId(user_id),
      device_id,
    })
    if (!existedUserDevice) {
      throw new BadRequestException('Device is not registered by system!')
    }
    const existedRefreshToken = await this.refreshTokenUsecase.getOneByFilter({
      device_id,
      expire_at: { $gt: getCurrentMilisecondTime() },
    })

    if (!existedRefreshToken) {
      return
    }
    await this.tokenUsecase.revokeToken({
      refresh_token: existedRefreshToken.refresh_token,
      device_id,
    })
  }
}
