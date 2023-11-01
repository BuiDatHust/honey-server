import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { Types } from 'mongoose'

export class GetSearchSettingResponse {
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
  distance_preference?: number

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  unit_distance?: string

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  is_only_show_in_distance?: boolean

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  min_age_preference?: number

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  max_age_preference?: number

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  is_only_show_in_age?: boolean

  @ApiPropertyOptional()
  @Expose()
  created_at: string

  @ApiPropertyOptional()
  @Expose()
  updated_at?: string
}
