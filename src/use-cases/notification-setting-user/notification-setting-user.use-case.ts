import { IDataServices } from '@core/abstracts'
import { NotificationSetting } from '@frameworks/data-servies/mongodb/models/notification-setting.model'
import { Injectable } from '@nestjs/common'
import { CreateNotificationSettingDto } from '@use-cases/notification-setting-user/dto/create-notification-setting.dto'
import { UpdateNotificationSettingDto } from '@use-cases/notification-setting-user/dto/update-notification-setting.dto'
import { Types } from 'mongoose'
import { PinoLogger } from 'nestjs-pino'
import { NotificationSettingFactory } from './notification-setting.factory'

@Injectable()
export class NotificationSettingUserUsecase {
  constructor(
    private readonly logger: PinoLogger,
    private dataService: IDataServices,
    private notificationSettingFactory: NotificationSettingFactory,
  ) {
    this.logger.setContext(NotificationSettingUserUsecase.name)
  }

  public async createNotificationSetting(
    dto: CreateNotificationSettingDto,
  ): Promise<NotificationSetting> {
    this.logger.debug({ dto }, 'createNotificationSetting')
    const attribute = this.notificationSettingFactory.createNotificationSetting(dto)
    const existedNotiSetting = await this.dataService.notificationSettings.getOne({
      user_id: new Types.ObjectId(dto.user_id),
    })
    if (existedNotiSetting) {
      const result = await this.dataService.notificationSettings.update(
        existedNotiSetting._id,
        attribute,
      )
      return result
    }

    const notificationSetting = await this.dataService.notificationSettings.create(attribute)
    return notificationSetting
  }

  public async updateNotificationSetting(user_id: string, dto: UpdateNotificationSettingDto) {
    this.logger.debug({ dto }, 'updateNotificationSetting')
    const notificationSetting = await this.dataService.notificationSettings.updateByFilter(
      { user_id: new Types.ObjectId(user_id) },
      dto,
    )

    return notificationSetting
  }
}
