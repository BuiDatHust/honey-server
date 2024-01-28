import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { MEETING_RATING, MEETING_STATUS, TYPE_MEETING } from '../constant/meeting.constant'

@Schema()
export class MeetingRecord {
  _id: string

  @Prop({ required: true, type: String, ref: 'User' })
  first_user_id: string

  @Prop({ required: true, type: String, ref: 'User' })
  second_user_id: string

  @Prop({ required: true })
  duration: number

  @Prop({ default: MEETING_STATUS.NOT_HAPPENING, enum: MEETING_STATUS })
  status: string

  @Prop({ required: true, enum: TYPE_MEETING })
  type_meeting: string

  @Prop({ enum: MEETING_RATING })
  first_user_rating: string

  @Prop({ enum: MEETING_RATING })
  second_user_rating: string

  @Prop({ default: false })
  is_first_user_canceling: boolean

  @Prop({ default: false })
  is_second_user_canceling: boolean

  @Prop({ required: true })
  created_at: number
}

export type MeetingRecordDocument = MeetingRecord & Document

export const MeetingRecordSchema = SchemaFactory.createForClass(MeetingRecord)
