import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { TYPE_CONTENT, TYPE_MESSAGE, TYPE_REACTION } from '../constant/chat.constant'

@Schema()
export class Message {
  _id?: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  sender_user_id: string | Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  reciever_user_id: string | Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'ChatSetting' })
  chat_seeting_id?: string | Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'MeetingRecord' })
  meeting_record_id?: string | Types.ObjectId

  @Prop({})
  content: string

  @Prop({ enum: TYPE_REACTION })
  reaction?: string

  @Prop({ required: true, enum: TYPE_CONTENT })
  type_content: string

  @Prop({ required: true, enum: TYPE_MESSAGE })
  type_message: string

  @Prop({ required: true })
  created_at: number

  @Prop({ required: false })
  updated_at?: number

  @Prop({ required: false })
  deleted_at?: number
}

export type MessageDocument = Message & Document

export const MessageSchema = SchemaFactory.createForClass(Message)
