import { IInAppNotificationServices } from '@core/abstracts/in-app-notification.abstract'
import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { FirebaseFcmService } from './firebase-fcm.service'

@Module({
  imports: [DataServicesModule],
  providers: [
    {
      provide: IInAppNotificationServices,
      useClass: FirebaseFcmService,
    },
  ],
  exports: [IInAppNotificationServices],
})
export class FirebaseFcmModule {}
