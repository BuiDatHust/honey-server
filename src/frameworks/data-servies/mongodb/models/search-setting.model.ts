import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { UNIT_DISTANCE } from '../constant/account-setting.constant'

@Schema()
export class SearchSetting {
  _id?: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: string | Types.ObjectId

  @Prop({ default: 10 })
  distance_preference?: number

  @Prop({ type: String, enum: UNIT_DISTANCE, default: UNIT_DISTANCE.KILOMETERS })
  unit_distance: string

  @Prop({ default: false })
  is_only_show_in_distance?: boolean

  @Prop({ default: 18 })
  min_age_preference?: number

  @Prop({ default: 25 })
  max_age_preference?: number

  @Prop({ default: false })
  is_only_show_in_age?: boolean

  @Prop({ required: true })
  created_at: number

  @Prop({})
  updated_at?: number
}

export type SearchSettingDocument = SearchSetting & Document

export const SearchSettingSchema = SchemaFactory.createForClass(SearchSetting)
