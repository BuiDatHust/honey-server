import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import {
  NOTIFICATION_STATUS,
  NOTIFICATION_USECASE_TYPE,
} from '../constant/notification-log.constant'

@Schema()
export class NotificationLog {
  _id?: string

  @Prop({ required: true, enum: Object.values(NOTIFICATION_STATUS) })
  status: string

  @Prop({ required: true, enum: Object.values(NOTIFICATION_USECASE_TYPE) })
  notification_usecase_type: string

  @Prop({ required: true })
  payload_without_noti_id: string

  @Prop({ required: true })
  created_at: number

  @Prop({})
  updated_at?: number
}

export type NotificationLogDocument = NotificationLog & Document

export const NotificationLogSchema = SchemaFactory.createForClass(NotificationLog)
