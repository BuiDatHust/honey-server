import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { CreateEmailSettingDto } from './create-email-setting.dto'
import { CreatePushNotificationSettingDto } from './create-push-notification-setting.dto'

export class GetNotificationSettingResponse {
  @ApiProperty()
  @Expose()
  @Type(() => String)
  _id: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  user_id: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Type(() => CreateEmailSettingDto)
  email_setting: CreateEmailSettingDto

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Type(() => CreatePushNotificationSettingDto)
  push_notification_setting: CreatePushNotificationSettingDto

  @ApiPropertyOptional()
  @Expose()
  created_at: number

  @ApiPropertyOptional()
  @Expose()
  updated_at?: number
}
