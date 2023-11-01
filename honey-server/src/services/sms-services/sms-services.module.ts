import { TwilioClientModule } from '@frameworks/sms-services/twilio/twilio-client.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [TwilioClientModule],
  exports: [TwilioClientModule],
})
export class SmsServiceModule {}
