import { Expose, Type } from '@nestjs/class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { Types } from 'mongoose'
import { GetAccountSettingResponse } from '../account-setting/get-account-setting.response'
import { GetNotificationSettingResponse } from '../notification-setting/get-notification-setting.response'
import { GetSearchSettingResponse } from '../search-setting/get-search-setting.response'

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
  @Transform(params => params.obj._id.toString())
  _id: Types.ObjectId

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
  @Type(() => Number)
  media_order?: number[]

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
  visualization_fields?: string[]

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
  created_at: string

  @ApiPropertyOptional()
  @Expose()
  updated_at?: string

  @ApiPropertyOptional()
  @Expose()
  deleted_at?: string
}
