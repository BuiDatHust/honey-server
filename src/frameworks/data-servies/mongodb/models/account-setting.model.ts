import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { UNIT_DISTANCE } from '../constant/account-setting.constant'

@Schema()
export class AccountSetting {
  _id: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: string | Types.ObjectId

  @Prop()
  language: string

  @Prop({ type: String, enum: UNIT_DISTANCE, default: UNIT_DISTANCE.KILOMETERS })
  unit_distance: string

  @Prop({ required: true })
  created_at: number

  @Prop()
  updated_at?: number
}

export type AccountSettingDocument = AccountSetting & Document

export const AccountSettingSchema = SchemaFactory.createForClass(AccountSetting)
