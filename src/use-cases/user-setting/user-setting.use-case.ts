import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { Injectable } from '@nestjs/common'
import { AccountSettingUserUseCase } from '@use-cases/account-setting-user/account-setting-user.user-case'
import { NotificationSettingUserUsecase } from '@use-cases/notification-setting-user/notification-setting-user.use-case'
import { SearchSettingUserUsecase } from '@use-cases/search-setting-user/search-setting-user.use-case'
import { UpdateUserSettingRequestDto } from './dto/update-user-setting-request.dto'

@Injectable()
export class UserSettingUsecase {
  constructor(
    private readonly logger: ILoggerService,
    private accountSettingUsecase: AccountSettingUserUseCase,
    private searchSettingUsecase: SearchSettingUserUsecase,
    private notificationSettingUsecase: NotificationSettingUserUsecase,
  ) {
    this.logger.setContext(UserSettingUsecase.name)
  }

  async updateUserSetting(user_id: string, dto: UpdateUserSettingRequestDto) {
    this.logger.debug({ dto }, 'updateUserSetting')

    await Promise.all([
      this.accountSettingUsecase.updateAccountSetting(user_id, dto.account_setting),
      this.searchSettingUsecase.updateSearchSetting(user_id, dto.search_setting),
      this.notificationSettingUsecase.updateNotificationSetting(user_id, dto.notification_setting),
    ])
  }
}
