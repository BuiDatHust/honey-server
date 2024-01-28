import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { WalletUsecase } from './wallet.use-case'

@Module({
  imports: [DataServicesModule],
  providers: [WalletUsecase],
  exports: [WalletUsecase],
})
export class WalletUsecaseModule {}
