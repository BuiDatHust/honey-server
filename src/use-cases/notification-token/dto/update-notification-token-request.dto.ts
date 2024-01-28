import { Expose } from '@nestjs/class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty } from 'class-validator'

export class UpdateNotificationTokenRequestDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  token: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  is_disable: boolean
}
