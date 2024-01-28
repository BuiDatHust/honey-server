import { Expose } from '@nestjs/class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class SmsDataPayload {
  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  expire_time: number

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  unit_time: string

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  code: string
}
