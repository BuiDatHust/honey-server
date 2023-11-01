import { IMailServices } from '@core/abstracts/mail-services.abstract'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GmailService implements IMailServices {
  constructor(private mailerService: MailerService) {}

  async sendMail() {
    await this.mailerService.sendMail({})
  }
}
