import { Expose } from '@nestjs/class-transformer'
import { IsOptional } from '@nestjs/class-validator'

export class CreatePushNotificationSettingDto {
  @Expose()
  @IsOptional()
  is_send_new_match?: boolean

  @Expose()
  @IsOptional()
  is_send_new_message?: boolean

  @Expose()
  @IsOptional()
  is_send_message_like?: boolean
}
