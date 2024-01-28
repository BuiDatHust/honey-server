import { GMailModule } from '@frameworks/mail-services/gmail/gmail.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [GMailModule],
  exports: [GMailModule],
})
export class MailServiceModule {}
