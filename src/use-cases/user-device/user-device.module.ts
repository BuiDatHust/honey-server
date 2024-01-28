import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { UserDeviceFactory } from './user-device.factory'
import { UserDeviceUseCase } from './user-device.user-case'

@Module({
  imports: [DataServicesModule],
  providers: [UserDeviceFactory, UserDeviceUseCase],
  exports: [UserDeviceUseCase],
})
export class UserDeviceUsecaseModule {}
