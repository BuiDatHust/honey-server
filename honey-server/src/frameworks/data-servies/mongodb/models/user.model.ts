import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import {
  GENDER,
  PASSIONS,
  RELATIONSHIP_GOAL,
  SEXUAL_ORIENTATION,
  USER_STATUS,
} from '../constant/user.constant'

class Media {
  @Prop()
  url: string

  @Prop()
  width: number

  @Prop()
  height: number
}

class Location {
  @Prop({ default: 'Point' })
  type: string

  @Prop()
  coordinates: number[]
}

@Schema()
export class User {
  _id: Types.ObjectId

  @Prop({})
  firstname?: string

  @Prop({ required: true })
  phone_number: string

  @Prop({})
  email: string

  @Prop({
    minlength: 2,
    maxlength: 10,
    type: Media,
  })
  medias?: Media[]

  @Prop()
  media_order?: number[]

  @Prop({ enum: Object.keys(GENDER) })
  gender?: string

  @Prop({ enum: Object.keys(GENDER) })
  gender_show?: string

  @Prop()
  dob?: number

  @Prop()
  age?: number

  @Prop()
  height?: number

  @Prop({ enum: Object.keys(SEXUAL_ORIENTATION) })
  sexual_orientation?: string

  @Prop({ enum: Object.keys(RELATIONSHIP_GOAL) })
  relationship_goal?: string

  @Prop({ maxlength: 500 })
  description?: string

  @Prop({ required: true })
  country_code: string

  @Prop({ enum: Object.keys(PASSIONS), type: String, minlength: 5 })
  passions?: string[]

  @Prop()
  company?: string

  @Prop()
  job_title?: string

  @Prop()
  address?: string

  @Prop()
  languages?: string[]

  @Prop({ index: '2dsphere', type: Location })
  location?: Location

  @Prop()
  visualization_fields?: string[]

  @Prop()
  completation_percentage?: number

  @Prop()
  is_verified?: boolean

  @Prop({ default: USER_STATUS.ACTIVE, enum: Object.values(USER_STATUS) })
  status: string

  @Prop()
  banned_at?: number

  @Prop()
  unban_at?: number

  @Prop({ default: false })
  is_verified_phone?: boolean

  @Prop({ default: false })
  is_verified_email?: boolean

  @Prop({ type: Types.ObjectId, ref: 'AccountSetting' })
  account_setting: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'NotificationSetting' })
  notification_setting: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'SearchSetting' })
  search_setting: Types.ObjectId

  @Prop({})
  score?: number

  @Prop({ required: true })
  created_at: number

  @Prop({})
  updated_at?: number

  @Prop({})
  deleted_at?: number
}

export type UserDocument = User & Document

export const UserSchema = SchemaFactory.createForClass(User)
