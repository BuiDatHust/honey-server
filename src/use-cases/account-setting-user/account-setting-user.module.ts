import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { AccountSettingFactory } from './account-setting-user.factory'
import { AccountSettingUserUseCase } from './account-setting-user.user-case'

@Module({
  imports: [DataServicesModule],
  providers: [AccountSettingFactory, AccountSettingUserUseCase],
  exports: [AccountSettingUserUseCase],
})
export class AccountSettingUserUsecaseModule {}
