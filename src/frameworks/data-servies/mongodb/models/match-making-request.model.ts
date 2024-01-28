import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { MATCH_MAKING_REQUEST_STATUS, TYPE_MATCH_MAKING } from '../constant/match-making.constant'

@Schema()
export class MatchMakingRequest {
  _id?: string

  @Prop({ required: true, type: String, ref: 'User' })
  user_id: string

  @Prop({ default: MATCH_MAKING_REQUEST_STATUS.PENDING, enum: MATCH_MAKING_REQUEST_STATUS })
  status?: string

  @Prop({ required: true, enum: TYPE_MATCH_MAKING })
  type_match_making: string

  @Prop({ required: true })
  created_at: number

  @Prop({})
  updated_at?: number
}

export type MatchMakingRequestDocument = MatchMakingRequest & Document

export const MatchMakingRequestSchema = SchemaFactory.createForClass(MatchMakingRequest)
