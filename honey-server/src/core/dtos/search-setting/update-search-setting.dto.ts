import { Expose } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class UpdateSearchSettingDto {
  @Expose()
  @IsOptional()
  distance_preference?: number

  @Expose()
  @IsOptional()
  unit_distance?: string

  @Expose()
  @IsOptional()
  is_only_show_in_distance?: boolean

  @Expose()
  @IsOptional()
  min_age_preference?: number

  @Expose()
  @IsOptional()
  max_age_preference?: number

  @Expose()
  @IsOptional()
  is_only_show_in_age?: boolean
}
