import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { SESSION_HISTORY_TYPE } from '../constant/session-history.constant'

@Schema()
export class SessionHistory {
  _id?: string

  @Prop({ enum: Object.keys(SESSION_HISTORY_TYPE), required: true })
  type_session_history: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserDevice' })
  user_device_id: string | Types.ObjectId

  @Prop({ required: true })
  coordinations: number[]

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: string | Types.ObjectId

  @Prop({ required: true })
  created_at: number
}

export type SessionHistoryDocument = SessionHistory & Document

export const SessionHistorySchema = SchemaFactory.createForClass(SessionHistory)
