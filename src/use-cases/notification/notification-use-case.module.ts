import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { InAppNotificationServiceModule } from '@services/in-app-notification-services/in-app-notification-services.module'
import { MailServiceModule } from '@services/mail-services/mail-services.module'
import { SmsServiceModule } from '@services/sms-services/sms-services.module'
import { NotificationUsecase } from './notification.use-case'

@Module({
  imports: [
    DataServicesModule,
    SmsServiceModule,
    MailServiceModule,
    InAppNotificationServiceModule,
  ],
  providers: [NotificationUsecase],
  exports: [NotificationUsecase],
})
export class NotificationUsecaseModule {}
