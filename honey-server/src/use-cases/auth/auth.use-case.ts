import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { CreateAccountSettingDto } from '@core/dtos/account-setting/create-account-setting.dto'
import { ManualLoginRequestDto } from '@core/dtos/auth/manual-login-request.dto'
import { ManualRegisterRequestDto } from '@core/dtos/auth/manual-register-request.dto'
import { OnboardRequestDto } from '@core/dtos/auth/on-board-request.dto'
import { CreateNotificationSettingDto } from '@core/dtos/notification-setting/create-notification-setting.dto'
import { VerifyOtpDto } from '@core/dtos/otp/verify-otp.dto'
import { CreateSearchSettingDto } from '@core/dtos/search-setting/create-search-setting.dto'
import { TokenResponseDto } from '@core/dtos/token/token-response.dto'
import { UpdateUserOnboardingDto } from '@core/dtos/user/update-user-onboarding.dto'
import { OTP_USECASE, TYPE_OTP } from '@frameworks/data-servies/mongodb/constant/otp.constant'
import { USER_STATUS } from '@frameworks/data-servies/mongodb/constant/user.constant'
import { BadRequestException, Injectable } from '@nestjs/common'
import { AccountSettingUserUseCase } from '@use-cases/account-setting-user/account-setting-user.user-case'
import { NotificationSettingUserUsecase } from '@use-cases/notification-setting-user/notification-setting-user.use-case'
import { OtpUseCase } from '@use-cases/otp/otp.use-case'
import { RefreshTokenUsecase } from '@use-cases/refresh-token/refresh-token.use-case'
import { SearchSettingUserUsecase } from '@use-cases/search-setting-user/search-setting-user.use-case'
import { TokenUsecase } from '@use-cases/token/token.use-case'
import { UserDeviceUseCase } from '@use-cases/user-device/user-device.user-case'
import { UserUsecase } from '@use-cases/user/user.use-case'
import { Types } from 'mongoose'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'
import { getPhoneWithCountryCode } from 'src/helpers/phone.helper'
import { LOG_OUT_TYPE } from './constant/auth.constant'

@Injectable()
export class AuthUseCase {
  constructor(
    private readonly logger: ILoggerService,
    private otpUsecase: OtpUseCase,
    private userUseCase: UserUsecase,
    private searchSettingUsecase: SearchSettingUserUsecase,
    private notificationSettingUsecase: NotificationSettingUserUsecase,
    private accountSettingUsecase: AccountSettingUserUseCase,
    private tokenUsecase: TokenUsecase,
    private refreshTokenUsecase: RefreshTokenUsecase,
    private userDeviceUsercase: UserDeviceUseCase,
  ) {
    this.logger.setContext(AuthUseCase.name)
  }

  public async manualRegister(dto: ManualRegisterRequestDto) {
    this.logger.debug({ dto }, 'manualRegister')
    const { phone_number, country_code, code, email } = dto
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
      const attribute = { phone_number, country_code, email }
      await this.userUseCase.createUser(attribute)
    }

    return isVerified
  }

  public async handleOnBoard(dto: OnboardRequestDto) {
    this.logger.debug({ dto }, 'handleOnBoard')

    const { phone_number, country_code } = dto
    const existedUser = await this.userUseCase.getOne({ phone_number, country_code })
    if (!existedUser) {
      throw new BadRequestException('User not found!')
    }
    if (existedUser.status !== USER_STATUS.ONBOARD_PENDING) {
      throw new BadRequestException('User is not in onboarding pending!')
    }

    const accountSettingAttribute: CreateAccountSettingDto = { user_id: existedUser._id }
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

    const tokenData = await this.tokenUsecase.generateTokenManualLogin({
      user_id: existedUser._id,
      phone_number,
      email: existedUser.email,
      country_code,
    })
    return tokenData
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
      status: { $in: [USER_STATUS.ACTIVE, USER_STATUS.HIDE] },
    })
    if (!existedUser) {
      throw new BadRequestException('User is not exist!')
    }

    // case login with old device
    if (dto.device_id) {
      await this.validateDevice(existedUser._id, dto.device_id)
    }

    const tokenData = await this.tokenUsecase.generateTokenManualLogin({
      user_id: existedUser._id,
      phone_number,
      email: existedUser.email,
      country_code,
      device_id: dto.device_id,
    })
    return tokenData
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
    const payload = await this.tokenUsecase.verifyRefreshToken(refresh_token)

    await this.tokenUsecase.revokeToken({ refresh_token, device_id: payload.device_id })

    const user = await this.userUseCase.getOne({
      email: payload.email,
      status: { $in: [USER_STATUS.ACTIVE, USER_STATUS.HIDE] },
    })
    if (!user) {
      throw new BadRequestException('Not exist user!')
    }
    const tokenData = await this.tokenUsecase.generateTokenManualLogin({
      user_id: user._id,
      phone_number: user.phone_number,
      country_code: user.country_code,
      email: user.email,
      device_id: payload.device_id,
    })
    return tokenData
  }

  async validateDevice(user_id: Types.ObjectId, device_id: string) {
    const existedUserDevice = await this.userDeviceUsercase.getUserDeviceByFilter({
      user_id,
      device_id,
    })
    if (!existedUserDevice) {
      throw new BadRequestException('Device is not registered by system!')
    }
    const existedRefreshToken = await this.refreshTokenUsecase.getOneByFilter({
      device_id,
      expire_at: { $gt: getCurrentMilisecondTime() },
    })

    await this.tokenUsecase.revokeToken({
      refresh_token: existedRefreshToken.refresh_token,
      device_id,
    })
  }
}
