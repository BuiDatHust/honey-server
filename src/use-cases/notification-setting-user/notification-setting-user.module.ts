import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { NotificationSettingUserUsecase } from './notification-setting-user.use-case'
import { NotificationSettingFactory } from './notification-setting.factory'

@Module({
  imports: [DataServicesModule],
  providers: [NotificationSettingFactory, NotificationSettingUserUsecase],
  exports: [NotificationSettingUserUsecase],
})
export class NotificationSettingUserUsecaseModule {}
