import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { ComplaintUsecase } from './complaint.use-case'

@Module({
  imports: [DataServicesModule],
  providers: [ComplaintUsecase],
  exports: [ComplaintUsecase],
})
export class ComplaintUsecaseModule {}
