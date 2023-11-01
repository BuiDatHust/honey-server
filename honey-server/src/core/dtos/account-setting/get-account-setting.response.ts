import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty, IsOptional } from '@nestjs/class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Types } from 'mongoose'

export class GetAccountSettingResponse {
  @ApiProperty()
  @Expose()
  _id: Types.ObjectId

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  user_id: Types.ObjectId

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
  created_at: string

  @ApiPropertyOptional()
  @Expose()
  updated_at?: string
}
