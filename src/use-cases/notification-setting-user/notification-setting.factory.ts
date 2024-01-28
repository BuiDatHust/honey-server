import { NotificationSetting } from '@frameworks/data-servies/mongodb/models/notification-setting.model'
import { Injectable } from '@nestjs/common'
import { CreateNotificationSettingDto } from '@use-cases/notification-setting-user/dto/create-notification-setting.dto'
import { UpdateNotificationSettingDto } from '@use-cases/notification-setting-user/dto/update-notification-setting.dto'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'

@Injectable()
export class NotificationSettingFactory {
  constructor() {}

  public createNotificationSetting(data: CreateNotificationSettingDto): NotificationSetting {
    const { email_setting, push_notification_setting } = data
    const attribute = new NotificationSetting()

    attribute.user_id = data.user_id
    attribute.email_setting = email_setting
    attribute.push_notification_setting = push_notification_setting
    attribute.created_at = getCurrentMilisecondTime()

    email_setting.is_send_new_match = email_setting.is_send_new_match ?? false
    email_setting.is_send_new_message = email_setting.is_send_new_message ?? false
    push_notification_setting.is_send_message_like =
      push_notification_setting.is_send_message_like ?? false
    push_notification_setting.is_send_new_match =
      push_notification_setting.is_send_new_match ?? false
    push_notification_setting.is_send_new_message =
      push_notification_setting.is_send_new_message ?? false

    return attribute
  }

  public updateNotificationSetting(data: UpdateNotificationSettingDto): NotificationSetting {
    const { email_setting, push_notification_setting } = data
    const attribute = new NotificationSetting()

    attribute.email_setting = email_setting
    attribute.push_notification_setting = push_notification_setting
    attribute.updated_at = getCurrentMilisecondTime()

    email_setting.is_send_new_match = email_setting.is_send_new_match ?? false
    email_setting.is_send_new_message = email_setting.is_send_new_message ?? false
    push_notification_setting.is_send_message_like =
      push_notification_setting.is_send_message_like ?? false
    push_notification_setting.is_send_new_match =
      push_notification_setting.is_send_new_match ?? false
    push_notification_setting.is_send_new_message =
      push_notification_setting.is_send_new_message ?? false

    return attribute
  }
}
