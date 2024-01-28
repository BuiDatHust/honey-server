import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { FEATURE } from '../constant/feature.constant'
import { Types } from 'mongoose'

@Schema()
export class FeatureUsageCount {
  _id?: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: string

  @Prop({ required: true })
  time: number

  @Prop({ enum: FEATURE, required: true })
  feature_name: string

  @Prop({})
  total: number

  @Prop({ required: true })
  created_at: number
}

export type FeatureUsageCountDocument = FeatureUsageCount & Document

export const FeatureUsageCountSchema = SchemaFactory.createForClass(FeatureUsageCount)
