import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { FRIEND_STATUS, TYPE_MATCHING } from '@use-cases/user/constant/user.constant'
import { Document, Types } from 'mongoose'

@Schema()
export class Friend {
  _id?: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  source_user: string | Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  target_user: string | Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'ChatSetting' })
  chat_seeting_id: string | Types.ObjectId

  @Prop({ default: TYPE_MATCHING.SWIPE, enum: TYPE_MATCHING })
  type_matching?: string

  @Prop({ default: false })
  is_chatted?: boolean

  @Prop({ type: String, ref: 'User' })
  block_by?: string

  @Prop({ default: FRIEND_STATUS.ACTIVE, enum: FRIEND_STATUS })
  status?: string

  @Prop({ required: true })
  created_at: number
}

export type FriendDocument = Friend & Document

export const FriendSchema = SchemaFactory.createForClass(Friend)
