import { IMailServices } from '@core/abstracts/mail-services.abstract'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { SendMailPropety } from './dto/send-mail-property.dto'

@Injectable()
export class GmailService implements IMailServices {
  constructor(private mailerService: MailerService) {}

  public async sendMail<T>(prop: SendMailPropety<T>) {
    await this.mailerService.sendMail(prop)
  }
}
