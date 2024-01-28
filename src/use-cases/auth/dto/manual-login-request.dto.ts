import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty, IsOptional, ValidateIf } from '@nestjs/class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class ManualLoginRequestDto {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  device_id?: string

  @ApiPropertyOptional()
  @Expose()
  @IsNotEmpty()
  @Type(() => Number)
  coordinations: number[]

  @ApiPropertyOptional()
  @Expose()
  @ValidateIf(val => !val)
  @IsOptional()
  device_name?: string

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  phone_number: string

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  country_code: string

  @ApiProperty()
  @Expose()
  code: string
}
