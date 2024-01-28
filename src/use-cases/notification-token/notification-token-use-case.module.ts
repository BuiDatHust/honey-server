import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { NotificationTokenUsecase } from './notification-token.use-case'

@Module({
  imports: [DataServicesModule],
  providers: [NotificationTokenUsecase],
  exports: [NotificationTokenUsecase],
})
export class NotificationUsecaseTokenModule {}
