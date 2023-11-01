import { Module } from '@nestjs/common'
import { AccountSettingUserUsecaseModule } from '@use-cases/account-setting-user/account-setting-user.module'
import { NotificationSettingUserUsecaseModule } from '@use-cases/notification-setting-user/notification-setting-user.module'
import { SearchSettingUserUsecasewModule } from '@use-cases/search-setting-user/search-setting-user.module'
import { UserSettingUsecase } from './user-setting.use-case'

@Module({
  imports: [
    AccountSettingUserUsecaseModule,
    SearchSettingUserUsecasewModule,
    NotificationSettingUserUsecaseModule,
  ],
  providers: [UserSettingUsecase],
  exports: [UserSettingUsecase],
})
export class UserSettingUsecaseModule {}
