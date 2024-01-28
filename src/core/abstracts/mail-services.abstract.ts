import { SendMailPropety } from '@frameworks/mail-services/gmail/dto/send-mail-property.dto'

export abstract class IMailServices {
  abstract sendMail<T>(prop: SendMailPropety<T>): Promise<void>
}
