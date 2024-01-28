import {
  DEVICE_TYPE,
  NOTIFICATION_TOKEN_STATUS,
} from '@frameworks/data-servies/mongodb/constant/notification-token.constant'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class CreateNotificationTokenRequestDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  token: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsEnum(DEVICE_TYPE)
  device_type: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsEnum(NOTIFICATION_TOKEN_STATUS)
  status: string
}
