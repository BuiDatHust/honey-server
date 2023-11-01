import { ConfigurationService } from '@configuration/configuration.service'
import { IDataServices } from '@core/abstracts'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { ISmsServices } from '@core/abstracts/sms-services.abstract'
import { SendOtpRequestDto } from '@core/dtos/otp/send-otp-request.dto'
import { SendSmsOtpDto } from '@core/dtos/otp/send-sms-otp.dto'
import { VerifyOtpDto } from '@core/dtos/otp/verify-otp.dto'
import { ISmsData } from '@core/type/sms-data.type'
import { OTP_USECASE, TYPE_OTP } from '@frameworks/data-servies/mongodb/constant/otp.constant'
import { TYPE_SMS } from '@frameworks/sms-services/twilio/constant/twilio.constant'
import { Injectable } from '@nestjs/common'
import { generateOTP } from 'src/helpers/code-generator.helper'
import { getCurrentMilisecondTime, getExpiry } from 'src/helpers/datetime.helper'
import { getPhoneWithCountryCode } from '../../helpers/phone.helper'
import { OtpFactoryService } from './otp-factory.service'

@Injectable()
export class OtpUseCase {
  constructor(
    private logger: ILoggerService,
    private dataService: IDataServices,
    private smsService: ISmsServices,
    private readonly configService: ConfigurationService,
    private readonly otpFactoryService: OtpFactoryService,
  ) {
    this.logger.setContext(OtpUseCase.name)
  }

  // todo: delete all old otp exist with specific phone, otp use case and country code after send new otp
  public async sendOtp(dto: SendOtpRequestDto) {
    this.logger.debug({ dto }, 'sendOtp')
    const { otp_usecase } = dto

    switch (otp_usecase) {
      case OTP_USECASE.REGISTER_ACCOUNT:
        const registerSmsOtp: SendSmsOtpDto = {
          phone_number: dto.phone_number,
          country_code: dto.country_code,
          otp_usecase: dto.otp_usecase,
        }
        await this.sendRegisterSms(registerSmsOtp)

        break
      case OTP_USECASE.MANUAL_LOGIN_ACCOUNT:
        const manualLoginSmsOtp: SendSmsOtpDto = {
          phone_number: dto.phone_number,
          country_code: dto.country_code,
          otp_usecase: dto.otp_usecase,
        }
        await this.sendLoginSms(manualLoginSmsOtp)

        break
      default:
        break
    }
  }

  public async sendRegisterSms(dto: SendSmsOtpDto) {
    this.logger.debug({ dto }, 'sendRegisterSms')
    const { phone_number, country_code } = dto
    const phone = getPhoneWithCountryCode(phone_number, country_code)
    const code = generateOTP(+this.configService.get<number>('otp_code_length'))
    const expire_time = this.configService.get<number>('sms_otp_expire_time')
    const unit_time = 'minutes'
    const expire_at = getExpiry(3600 * expire_time, unit_time)

    const data: ISmsData = { expire_time, unit_time, code }
    await this.smsService.sendSMS({ type_sms: TYPE_SMS.REGISTER_OTP, to_phone_number: phone, data })

    const createNewOtpAttr = this.otpFactoryService.createNewOtp({
      code,
      expire_at,
      phone_number: phone,
      type_otp: TYPE_OTP.PHONE,
      otp_usecase: OTP_USECASE.REGISTER_ACCOUNT,
    })
    await this.dataService.otps.deleteByField({ phone_number: phone, type_otp: TYPE_OTP.PHONE })
    await this.dataService.otps.create(createNewOtpAttr)
  }

  public async sendLoginSms(dto: SendSmsOtpDto) {
    this.logger.debug({ dto }, 'sendLoginSms')
    const { phone_number, country_code } = dto
    const phone = getPhoneWithCountryCode(phone_number, country_code)
    const code = generateOTP(+this.configService.get<number>('otp_code_length'))
    const expire_time = this.configService.get<number>('sms_otp_expire_time')
    const unit_time = 'minutes'
    const expire_at = getExpiry(3600 * expire_time, unit_time)

    const data: ISmsData = { expire_time, unit_time, code }
    await this.smsService.sendSMS({ type_sms: TYPE_SMS.MANUAL_LOGIN, to_phone_number: phone, data })

    const createNewOtpAttr = this.otpFactoryService.createNewOtp({
      code,
      expire_at,
      phone_number: phone,
      type_otp: TYPE_OTP.PHONE,
      otp_usecase: OTP_USECASE.MANUAL_LOGIN_ACCOUNT,
    })
    await this.dataService.otps.deleteByField({ phone_number: phone, type_otp: TYPE_OTP.PHONE })
    await this.dataService.otps.create(createNewOtpAttr)
  }

  public async verifyOtp(data: VerifyOtpDto): Promise<boolean> {
    const { code, type_otp, otp_usecase } = data
    const currentTime = getCurrentMilisecondTime()
    const filter: any = {
      type_otp,
      code,
      expire_at: { $gt: currentTime },
      otp_usecase,
    }

    if (type_otp == TYPE_OTP.PHONE) {
      filter.phone_number = data.phone
    }
    if (type_otp == TYPE_OTP.EMAIL) {
      filter.email = data.email
    }

    const existedOtp = await this.dataService.otps.getOne(filter)
    if (existedOtp) {
      await this.dataService.otps.deleteByField({ _id: existedOtp._id })
      return true
    }
    return false
  }
}
