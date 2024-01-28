import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import {
  GENDER,
  RELATIONSHIP_GOAL,
  SEXUAL_ORIENTATION,
  USER_STATUS,
} from '../constant/user.constant'
import { SearchSetting } from './search-setting.model'

class Media {
  @Prop()
  url?: string

  @Prop()
  width?: number

  @Prop()
  height?: number
}

class Location {
  @Prop({ default: 'Point' })
  type: string

  @Prop()
  coordinates: number[]
}

@Schema()
export class User {
  _id?: string

  @Prop({})
  firstname?: string

  @Prop({ required: true })
  phone_number: string

  @Prop({ required: false })
  email?: string

  @Prop({
    minlength: 2,
    maxlength: 10,
    type: Media,
  })
  medias?: Media[]

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
  @Prop({ required: true })
  country_code: string

  @Prop({ minlength: 5 })
  passions?: string[]

  @Prop()
  company?: string

  @Prop()
  job_title?: string

  @Prop()
  address?: string

  @Prop()
  languages?: string[]

  @Prop()
  coordinates: number[]

  @Prop({
    index: '2dsphere',
    type: Location,
    get: (location?: Location) => {
      if (!location) {
        return
      }

      return location.coordinates
    },
  })
  location?: Location

  // todo: change to hide fields
  @Prop()
  hide_fields?: string[]

  @Prop()
  show_medias: Media[]

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
  is_verified_email?: boolean

  @Prop({ type: Types.ObjectId, ref: 'AccountSetting' })
  account_setting: string | Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'NotificationSetting' })
  notification_setting: string | Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'SearchSetting' })
  search_setting: string | Types.ObjectId

  @Prop({})
  score?: number

  @Prop({ default: false })
  is_pending_chat_room?: boolean

  @Prop({ default: false })
  is_pending_voice_room?: boolean

  @Prop({ maxlength: 200 })
  message_status?: string

  searchSetting?: SearchSetting

  @Prop({ required: true })
  created_at: number

  @Prop({})
  updated_at?: number

  @Prop({})
  deleted_at?: number
}

export type UserDocument = User & Document

const UserSchem = SchemaFactory.createForClass(User)
UserSchem.virtual('searchSetting', {
  ref: 'SearchSetting',
  localField: 'search_setting',
  foreignField: '_id',
  justOne: true,
})

export const UserSchema = UserSchem
