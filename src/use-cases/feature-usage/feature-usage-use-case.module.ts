import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { FeatureUsageUsecase } from './feature-usage.use-case'

@Module({
  imports: [DataServicesModule],
  providers: [FeatureUsageUsecase],
  exports: [FeatureUsageUsecase],
})
export class FeatureUsageUsecaseModule {}
