import { Expose, Type } from '@nestjs/class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { GetAccountSettingResponse } from '../../../use-cases/account-setting-user/dto/get-account-setting.response'
import { GetNotificationSettingResponse } from '../../../use-cases/notification-setting-user/dto/get-notification-setting.response'
import { GetSearchSettingResponse } from '../../../use-cases/search-setting-user/dto/get-search-setting.response'

class Media {
  @ApiProperty()
  @Expose()
  url: string

  @ApiProperty()
  @Expose()
  width: number

  @ApiProperty()
  @Expose()
  height: number
}

class Location {
  @ApiProperty()
  @Expose()
  type: string

  @ApiProperty()
  @Expose()
  @Type(() => Number)
  coordinates: number[]
}

export class GetPersonalInfoResponse {
  @ApiProperty()
  @Expose()
  @Type(() => String)
  _id: string

  @ApiProperty()
  @Expose()
  phone_number: string

  @ApiProperty()
  @Expose()
  email: string

  @ApiProperty()
  @Expose()
  country_code: string

  @ApiPropertyOptional()
  @Expose()
  first_name?: string

  @ApiPropertyOptional()
  @Expose()
  age?: number

  @ApiPropertyOptional()
  @Expose()
  dob?: number

  @ApiPropertyOptional()
  @Expose()
  @Type(() => Media)
  medias?: Media[]

  @ApiPropertyOptional()
  @Expose()
  @Type(() => Media)
  show_medias?: Media[]

  @ApiPropertyOptional()
  @Expose()
  gender?: string

  @ApiPropertyOptional()
  @Expose()
  gender_show?: string

  @ApiPropertyOptional()
  @Expose()
  height?: number

  @ApiPropertyOptional()
  @Expose()
  sexual_orientation?: string

  @ApiPropertyOptional()
  @Expose()
  relationship_goal?: string

  @ApiPropertyOptional()
  @Expose()
  description?: string

  @ApiPropertyOptional()
  @Type(() => String)
  @Expose()
  passions?: string[]

  @ApiPropertyOptional()
  @Expose()
  company?: string

  @ApiPropertyOptional()
  @Expose()
  job_title?: string

  @ApiPropertyOptional()
  @Expose()
  address?: string

  @ApiPropertyOptional()
  @Expose()
  @Type(() => String)
  languages?: string[]

  @ApiPropertyOptional()
  @Expose()
  @Type(() => Location)
  location?: Location

  @ApiPropertyOptional()
  @Expose()
  @Type(() => String)
  hide_fields?: string[]

  @ApiPropertyOptional()
  @Expose()
  completation_percentage?: number

  @ApiPropertyOptional()
  @Expose()
  is_verified?: string

  @ApiPropertyOptional()
  @Expose()
  status?: string

  @ApiPropertyOptional()
  @Expose()
  banned_at?: string

  @ApiPropertyOptional()
  @Expose()
  unban_at?: string

  @ApiPropertyOptional()
  @Expose()
  is_verified_phone?: boolean

  @ApiPropertyOptional()
  @Expose()
  is_verified_email?: boolean

  @ApiProperty()
  @Expose()
  @Type(() => Number)
  coordinates: number[]

  @ApiProperty()
  @Expose()
  @Type(() => GetAccountSettingResponse)
  account_setting: GetAccountSettingResponse

  @ApiProperty()
  @Expose()
  @Type(() => GetNotificationSettingResponse)
  notification_setting: GetNotificationSettingResponse

  @ApiProperty()
  @Expose()
  @Type(() => GetSearchSettingResponse)
  search_setting: GetSearchSettingResponse

  @ApiPropertyOptional()
  @Expose()
  created_at: number

  @ApiPropertyOptional()
  @Expose()
  updated_at?: number

  @ApiPropertyOptional()
  @Expose()
  deleted_at?: string
}
