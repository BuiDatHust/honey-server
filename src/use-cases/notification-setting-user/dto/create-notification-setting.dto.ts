import { Expose, Type } from '@nestjs/class-transformer'
import { IsNotEmpty } from '@nestjs/class-validator'
import { CreateEmailSettingDto } from './create-email-setting.dto'
import { CreatePushNotificationSettingDto } from './create-push-notification-setting.dto'

export class CreateNotificationSettingDto {
  @Expose()
  @IsNotEmpty()
  user_id: string

  @Expose()
  @IsNotEmpty()
  @Type(() => CreateEmailSettingDto)
  email_setting: CreateEmailSettingDto

  @Expose()
  @IsNotEmpty()
  @Type(() => CreatePushNotificationSettingDto)
  push_notification_setting: CreatePushNotificationSettingDto
}
