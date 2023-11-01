import { UNIT_DISTANCE } from '@frameworks/data-servies/mongodb/constant/account-setting.constant'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsEnum, IsOptional } from 'class-validator'

export class UpdateAccountSettingDto {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  language?: string

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsEnum(UNIT_DISTANCE)
  unit_distance?: string
}
