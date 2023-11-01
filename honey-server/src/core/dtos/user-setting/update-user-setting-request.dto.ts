import { ValidateNested } from '@nestjs/class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UPDATE_USER_SETTING_TYPE } from '@use-cases/user-setting/constant/user-setting.constant'
import { Expose, Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, ValidateIf } from 'class-validator'
import { UpdateAccountSettingDto } from '../account-setting/update-account-setting.dto'
import { UpdateNotificationSettingDto } from '../notification-setting/update-notification-setting.dto'
import { UpdateSearchSettingDto } from '../search-setting/update-search-setting.dto'

export class UpdateUserSettingRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsEnum(UPDATE_USER_SETTING_TYPE)
  type: string

  @ApiPropertyOptional()
  @Expose()
  @ValidateIf(val => val.type === UPDATE_USER_SETTING_TYPE.ACCOUNT)
  @IsNotEmpty()
  @Type(() => UpdateAccountSettingDto)
  @ValidateNested({ each: true })
  account_setting: UpdateAccountSettingDto

  @ApiPropertyOptional()
  @Expose()
  @IsNotEmpty()
  @ValidateIf(val => val.type === UPDATE_USER_SETTING_TYPE.SEARCH)
  @Type(() => UpdateSearchSettingDto)
  search_setting: UpdateSearchSettingDto

  @ApiPropertyOptional()
  @Expose()
  @IsNotEmpty()
  @ValidateIf(val => val.type === UPDATE_USER_SETTING_TYPE.NOTIFICATION)
  @Type(() => UpdateNotificationSettingDto)
  notification_setting: UpdateNotificationSettingDto
}
