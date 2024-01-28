import { ConfigurationService } from '@configuration/configuration.service'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { ISmsServices } from '@core/abstracts/sms-services.abstract'
import { ISmsData } from '@core/type/sms-data.type'
import { BadRequestException, Injectable } from '@nestjs/common'
import { TwilioService } from 'nestjs-twilio'
import { TYPE_SMS } from './constant/twilio.constant'

@Injectable()
export class TwilioSmsService implements ISmsServices {
  public constructor(
    private logger: ILoggerService,
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigurationService,
  ) {
    this.logger.setContext(TwilioSmsService.name)
  }

  async sendSMS({
    type_sms,
    to_phone_number,
    data,
  }: {
    type_sms: TYPE_SMS
    to_phone_number: string
    data: ISmsData
  }) {
    try {
      const body = this._getMessageBody(type_sms, data)
      await this.twilioService.client.messages.create({
        body,
        from: this.configService.get('sms_phone_number'),
        to: to_phone_number,
      })
    } catch (error) {
      this.logger.error({ error }, 'sendSMS')
      if (error.status === 400) {
        throw new BadRequestException(error.messages)
      }

      throw error
    }
  }

  private _getMessageBody(type_sms: string, data: ISmsData) {
    let body = ''
    const { code, expire_time, unit_time } = data

    switch (type_sms) {
      case TYPE_SMS.REGISTER_OTP:
        body = `
                  Use this ${code} to verify your register otp.Please not share to any body.This otp will expire in ${expire_time} ${unit_time}
                `
      case TYPE_SMS.MANUAL_LOGIN:
        body = `
                  Use this ${code} to verify your login otp.Please not share to any body.This otp will expire in ${expire_time} ${unit_time}
                `
      default:
        break
    }

    return body
  }
}
