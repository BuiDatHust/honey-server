import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { UpdateUserSettingRequestDto } from '@core/dtos/user-setting/update-user-setting-request.dto'
import { Injectable } from '@nestjs/common'
import { AccountSettingUserUseCase } from '@use-cases/account-setting-user/account-setting-user.user-case'
import { NotificationSettingUserUsecase } from '@use-cases/notification-setting-user/notification-setting-user.use-case'
import { SearchSettingUserUsecase } from '@use-cases/search-setting-user/search-setting-user.use-case'
import { Types } from 'mongoose'
import { UPDATE_USER_SETTING_TYPE } from './constant/user-setting.constant'

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

  async updateUserSetting(user_id: Types.ObjectId, dto: UpdateUserSettingRequestDto) {
    this.logger.debug({ dto }, 'updateUserSetting')

    switch (dto.type) {
      case UPDATE_USER_SETTING_TYPE.ACCOUNT:
        await this.accountSettingUsecase.updateAccountSetting(user_id, dto.account_setting)

        break
      case UPDATE_USER_SETTING_TYPE.SEARCH:
        await this.searchSettingUsecase.updateSearchSetting(user_id, dto.search_setting)

        break
      case UPDATE_USER_SETTING_TYPE.NOTIFICATION:
        await this.notificationSettingUsecase.updateNotificationSetting(
          user_id,
          dto.notification_setting,
        )

        break
      default:
        break
    }
  }
}
