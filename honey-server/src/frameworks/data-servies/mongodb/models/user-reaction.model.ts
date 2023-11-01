import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { TYPE_MATCHING, TYPE_REACTION } from '@use-cases/user/constant/user.constant'
import { Document, Types } from 'mongoose'

@Schema()
export class UserReation {
  _id?: Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  source_user: Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  target_user: Types.ObjectId

  @Prop({ default: TYPE_MATCHING.SWIPE, enumL: TYPE_MATCHING })
  type_matching: string

  @Prop({ default: TYPE_REACTION.NOPE, enumL: TYPE_REACTION })
  type_reaction: string

  @Prop({ required: true })
  created_at: number
}

export type UserReationDocument = UserReation & Document

export const UserReationSchema = SchemaFactory.createForClass(UserReation)
