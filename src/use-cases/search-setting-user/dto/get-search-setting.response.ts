import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class GetSearchSettingResponse {
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
  created_at: number

  @ApiPropertyOptional()
  @Expose()
  updated_at?: number
}
