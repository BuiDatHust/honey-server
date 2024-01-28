import { ConfigurationModule } from '@configuration/configuration.module'
import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { LoggerServiceModule } from '@services/logger-services/logger-services.module'
import { NotificationUsecaseModule } from '@use-cases/notification/notification-use-case.module'
import { MailController } from './controller/mail.controller'
import { MobileController } from './controller/mobile.controller'
import { SmsController } from './controller/sms.controller'

@Module({
  imports: [
    LoggerServiceModule,
    ConfigurationModule.forRoot(),
    NotificationUsecaseModule,
    DataServicesModule,
  ],
  providers: [SmsController, MailController, MobileController],
})
export class NotificationWorkerModule {}
