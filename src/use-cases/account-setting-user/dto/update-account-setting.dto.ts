import { UNIT_DISTANCE } from '@frameworks/data-servies/mongodb/constant/account-setting.constant'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class UpdateAccountSettingDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  language: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsEnum(UNIT_DISTANCE)
  unit_distance: string
}
