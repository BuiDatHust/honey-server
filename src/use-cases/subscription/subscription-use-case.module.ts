import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { SubscriptionUsecase } from './subscription.use-case'

@Module({
  imports: [DataServicesModule],
  providers: [SubscriptionUsecase],
  exports: [SubscriptionUsecase],
})
export class SubscriptionUsecaseModule {}
