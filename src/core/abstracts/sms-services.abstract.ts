import { ISmsData } from '@core/type/sms-data.type'
import { TYPE_SMS } from '@frameworks/sms-services/twilio/constant/twilio.constant'

export abstract class ISmsServices {
  abstract sendSMS({
    type_sms,
    to_phone_number,
    data,
  }: {
    type_sms: TYPE_SMS
    to_phone_number: string
    data: ISmsData
  }): Promise<any>
}
