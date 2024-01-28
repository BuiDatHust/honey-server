import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { DEVICE_TYPE, NOTIFICATION_TOKEN_STATUS } from '../constant/notification-token.constant'

@Schema()
export class NotificationToken {
  _id?: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: string | Types.ObjectId

  @Prop({ required: true, enum: Object.values(DEVICE_TYPE) })
  device_type: string

  @Prop({ required: true })
  notification_token: string

  @Prop({ required: true, enum: Object.values(NOTIFICATION_TOKEN_STATUS) })
  status: string

  @Prop({ required: true })
  created_at: number
}

export type NotificationTokenDocument = NotificationToken & Document

export const NotificationTokenSchema = SchemaFactory.createForClass(NotificationToken)
