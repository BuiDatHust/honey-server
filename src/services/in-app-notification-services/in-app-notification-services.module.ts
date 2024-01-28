import { FirebaseFcmModule } from '@frameworks/in-app-notification-services/firebase-fcm/firebase-fcm.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [FirebaseFcmModule],
  exports: [FirebaseFcmModule],
})
export class InAppNotificationServiceModule {}
