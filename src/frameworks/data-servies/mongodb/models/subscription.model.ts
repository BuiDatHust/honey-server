import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { SUBSCRIPTION_TYPE } from '../constant/subscription.constant'
import { SUBSCRIPTION_DURATION } from '@use-cases/subscription/constant/subscription.constant'

@Schema()
export class Subscription {
  _id?: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: string | Types.ObjectId

  @Prop({ required: true, enum: SUBSCRIPTION_TYPE })
  type_subscription: string

  @Prop({ required: true })
  expired_at: number

  @Prop({ default: false })
  is_auto_extend?: boolean

  @Prop({ required: false, enum: SUBSCRIPTION_DURATION })
  duration?: string

  @Prop({ required: true })
  created_at: number

  @Prop({})
  updated_at?: number
}

export type SubscriptionDocument = Subscription & Document

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription)
