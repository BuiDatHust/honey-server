import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { MessgaeBrokerServiceModule } from '@services/message-broker-services/message-broker-service.module'
import { OtpFactoryService } from './otp-factory.service'
import { OtpUseCase } from './otp.use-case'

@Module({
  imports: [DataServicesModule, MessgaeBrokerServiceModule],
  providers: [OtpFactoryService, OtpUseCase],
  exports: [OtpUseCase, OtpFactoryService],
})
export class OtpUseCaseModule {}
