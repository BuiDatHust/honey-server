import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { TYPE_MATCHING, TYPE_REACTION } from '@use-cases/user/constant/user.constant'
import { Document, Types } from 'mongoose'

@Schema()
export class UserReation {
  _id?: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  source_user: string | Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User' })
  target_user: string | Types.ObjectId

  @Prop({ default: TYPE_MATCHING.SWIPE, enum: TYPE_MATCHING })
  type_matching: string

  @Prop({ default: TYPE_REACTION.NOPE, enum: TYPE_REACTION })
  type_reaction: string

  @Prop({ default: true })
  is_pending?: boolean

  @Prop({ required: true })
  created_at: number
}

export type UserReationDocument = UserReation & Document

export const UserReationSchema = SchemaFactory.createForClass(UserReation)
