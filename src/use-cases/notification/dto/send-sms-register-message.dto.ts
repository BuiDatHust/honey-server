import { Type } from '@nestjs/class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { SmsDataPayload } from './sms-data-payload.dto'

export class SensSmsRegisterMessageDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  notifcation_log_id: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  phone: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Type(() => SmsDataPayload)
  payload: SmsDataPayload
}
