import { UNIT_DISTANCE } from '@frameworks/data-servies/mongodb/constant/account-setting.constant'
import { IsEnum } from '@nestjs/class-validator'
import { Expose } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateSearchSettingDto {
  @Expose()
  @IsOptional()
  distance_preference?: number

  @Expose()
  @IsNotEmpty()
  @IsEnum(UNIT_DISTANCE)
  unit_distance: string

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
