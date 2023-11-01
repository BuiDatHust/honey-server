import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { FRIEND_STATUS, TYPE_MATCHING } from '@use-cases/user/constant/user.constant'
import { Document, Types } from 'mongoose'

@Schema()
export class Friend {
  _id?: Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  source_user: Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  target_user: Types.ObjectId

  @Prop({ default: TYPE_MATCHING.SWIPE, enum: TYPE_MATCHING })
  type_matching?: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  block_by?: Types.ObjectId

  @Prop({ default: FRIEND_STATUS.ACTIVE, enum: FRIEND_STATUS })
  status?: string

  @Prop({ required: true })
  created_at: number
}

export type FriendDocument = Friend & Document

export const FriendSchema = SchemaFactory.createForClass(Friend)
