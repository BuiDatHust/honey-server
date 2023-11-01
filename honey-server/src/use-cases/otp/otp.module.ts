import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { SmsServiceModule } from '@services/sms-services/sms-services.module'
import { OtpFactoryService } from './otp-factory.service'
import { OtpUseCase } from './otp.use-case'

@Module({
  imports: [DataServicesModule, SmsServiceModule],
  providers: [OtpFactoryService, OtpUseCase],
  exports: [OtpUseCase, OtpFactoryService],
})
export class OtpUseCaseModule {}
