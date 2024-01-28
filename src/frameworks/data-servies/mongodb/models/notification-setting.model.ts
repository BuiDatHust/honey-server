import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

class EmailSetting {
  @Prop({ default: false })
  is_send_new_match?: boolean

  @Prop({ default: false })
  is_send_new_message?: boolean
}

class PushNotificationSetting {
  @Prop({ default: false })
  is_send_new_match?: boolean

  @Prop({ default: false })
  is_send_new_message?: boolean

  @Prop({ default: false })
  is_send_message_like?: boolean
}

@Schema()
export class NotificationSetting {
  _id: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: string | Types.ObjectId

  @Prop({ type: EmailSetting })
  email_setting: EmailSetting

  @Prop({ type: PushNotificationSetting })
  push_notification_setting: PushNotificationSetting

  @Prop({ required: true })
  created_at: number

  @Prop()
  updated_at?: number
}

export type NotificationSettingDocument = NotificationSetting & Document

export const NotificationSettingSchema = SchemaFactory.createForClass(NotificationSetting)
