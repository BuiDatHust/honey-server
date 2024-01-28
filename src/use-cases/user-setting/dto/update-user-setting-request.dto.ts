import { ValidateNested } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UpdateAccountSettingDto } from '@use-cases/account-setting-user/dto/update-account-setting.dto'
import { UpdateNotificationSettingDto } from '@use-cases/notification-setting-user/dto/update-notification-setting.dto'
import { UpdateSearchSettingDto } from '@use-cases/search-setting-user/dto/update-search-setting.dto'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateUserSettingRequestDto {
  @ApiProperty()
  @Expose()
  @IsOptional()
  email?: string

  @ApiProperty()
  @Expose()
  @IsOptional()
  phone_number?: string

  @ApiProperty()
  @Expose()
  @IsOptional()
  country_code?: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Type(() => UpdateAccountSettingDto)
  @ValidateNested({ each: true })
  account_setting: UpdateAccountSettingDto

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Type(() => UpdateSearchSettingDto)
  search_setting: UpdateSearchSettingDto

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Type(() => UpdateNotificationSettingDto)
  notification_setting: UpdateNotificationSettingDto
}
