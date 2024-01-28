import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { FeatureUsageUsecaseModule } from '@use-cases/feature-usage/feature-usage-use-case.module'
import { WalletUsecaseModule } from '@use-cases/wallet/wallet-use-case.module'
import { FeatureUsecase } from './feature.use-case'

@Module({
  imports: [DataServicesModule, FeatureUsageUsecaseModule, WalletUsecaseModule],
  providers: [FeatureUsecase],
  exports: [FeatureUsecase],
})
export class FeatureUsecaseModule {}
