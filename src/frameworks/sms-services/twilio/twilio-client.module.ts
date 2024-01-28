import { ConfigurationModule } from '@configuration/configuration.module'
import { ConfigurationService } from '@configuration/configuration.service'
import { ISmsServices } from '@core/abstracts/sms-services.abstract'
import { Module } from '@nestjs/common'
import { LoggerServiceModule } from '@services/logger-services/logger-services.module'
import { TwilioModule } from 'nestjs-twilio'
import { TwilioSmsService } from './twilio-sms.service'

@Module({
  imports: [
    TwilioModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: (cfg: ConfigurationService) => ({
        accountSid: cfg.get('twilio.account_sid'),
        authToken: cfg.get('twilio.auth_token'),
      }),
      inject: [ConfigurationService],
    }),
    LoggerServiceModule,
  ],
  providers: [
    {
      provide: ISmsServices,
      useClass: TwilioSmsService,
    },
  ],
  exports: [ISmsServices],
})
export class TwilioClientModule {}
