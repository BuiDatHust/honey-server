import { Expose } from '@nestjs/class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator'

export class LoginThroughGoogleRequestDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  authorization_code: string

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
  @ValidateIf(val => !!val)
  @IsOptional()
  device_name?: string
}
