import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ManualRegisterRequestDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  country_code: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  phone_number: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  code: string
}
