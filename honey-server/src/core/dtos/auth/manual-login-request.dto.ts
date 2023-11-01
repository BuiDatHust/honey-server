import { Expose } from '@nestjs/class-transformer'
import { IsOptional } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ManualLoginRequestDto {
  @ApiProperty()
  @Expose()
  @IsOptional()
  device_id?: string

  @ApiProperty()
  @Expose()
  phone_number: string

  @ApiProperty()
  @Expose()
  country_code: string

  @ApiProperty()
  @Expose()
  code: string
}
