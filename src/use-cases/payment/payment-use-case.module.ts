import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { PaymentUsecase } from './payment.use-case'

@Module({
  imports: [DataServicesModule],
  providers: [PaymentUsecase],
  exports: [PaymentUsecase],
})
export class PaymentUsecaseModule {}
