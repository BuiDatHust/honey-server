import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty, IsOptional } from '@nestjs/class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class GetAccountSettingResponse {
  @ApiProperty()
  @Expose()
  @Type(() => String)
  _id: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  user_id: string

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  language?: string

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  unit_distance?: string

  @ApiPropertyOptional()
  @Expose()
  created_at: number

  @ApiPropertyOptional()
  @Expose()
  updated_at?: number
}
