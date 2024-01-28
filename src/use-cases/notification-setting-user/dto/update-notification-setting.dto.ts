import { Expose, Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { CreateEmailSettingDto } from './create-email-setting.dto'
import { CreatePushNotificationSettingDto } from './create-push-notification-setting.dto'

export class UpdateNotificationSettingDto {
  @Expose()
  @IsNotEmpty()
  @Type(() => CreateEmailSettingDto)
  email_setting: CreateEmailSettingDto

  @Expose()
  @IsNotEmpty()
  @Type(() => CreatePushNotificationSettingDto)
  push_notification_setting: CreatePushNotificationSettingDto
}
