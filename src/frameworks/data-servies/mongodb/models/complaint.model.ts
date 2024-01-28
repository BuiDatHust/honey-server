import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { COMPLAINT_REASON } from '../constant/complaint.constant'

@Schema()
export class Complaint {
  _id?: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  complaint_user_id: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: string

  @Prop({ enum: COMPLAINT_REASON, required: true })
  reason: string

  @Prop({ required: false })
  reason_detail?: string

  @Prop({ required: true })
  created_at: number
}

export type ComplaintDocument = Complaint & Document

export const ComplaintSchema = SchemaFactory.createForClass(Complaint)
