import { IDataServices } from '@core/abstracts'
import { CreateNotificationSettingDto } from '@core/dtos/notification-setting/create-notification-setting.dto'
import { UpdateNotificationSettingDto } from '@core/dtos/notification-setting/update-notification-setting.dto'
import { NotificationSetting } from '@frameworks/data-servies/mongodb/models/notification-setting.model'
import { Injectable } from '@nestjs/common'
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
    const notificationSetting = await this.dataService.notificationSettings.create(attribute)

    return notificationSetting
  }

  public async updateNotificationSetting(
    user_id: Types.ObjectId,
    dto: UpdateNotificationSettingDto,
  ) {
    this.logger.debug({ dto }, 'createNotificationSetting')
    const attribute = this.notificationSettingFactory.updateNotificationSetting(dto)
    await this.dataService.notificationSettings.updateByFilter(
      { user_id: new Types.ObjectId(user_id) },
      attribute,
    )
  }
}
