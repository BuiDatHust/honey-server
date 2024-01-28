import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from '@nestjs/class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class TokenResponseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  access_token: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  refresh_token: string

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  device_id: string
}
