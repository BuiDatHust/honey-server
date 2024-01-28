import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Message } from './message.model'

@Schema()
export class ChatSetting {
  _id?: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  first_user_id: string | Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  second_user_id: string | Types.ObjectId

  @Prop({})
  last_send_message_at?: number

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  last_message_id?: string | Types.ObjectId

  @Prop({ required: true })
  created_at: number

  messages?: Message[]

  @Prop()
  updated_at?: number
}

export type ChatSettingDocument = ChatSetting & Document

export const ChatSettingSchema = SchemaFactory.createForClass(ChatSetting)
