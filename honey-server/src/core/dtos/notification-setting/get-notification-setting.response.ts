import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { Types } from 'mongoose'
import { CreateEmailSettingDto } from './create-email-setting.dto'
import { CreatePushNotificationSettingDto } from './create-push-notification-setting.dto'

export class GetNotificationSettingResponse {
  @ApiProperty()
  @Expose()
  _id: Types.ObjectId

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  user_id: Types.ObjectId

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
  created_at: string

  @ApiPropertyOptional()
  @Expose()
  updated_at?: string
}
