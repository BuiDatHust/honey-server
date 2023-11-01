import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema()
export class RefreshToken {
  _id: Types.ObjectId

  @Prop({ required: true })
  refresh_token: string

  @Prop({ required: true })
  device_id: string

  @Prop({ required: true })
  expire_at: number

  @Prop({ required: true })
  created_at: number
}

export type RefreshTokenDocument = RefreshToken & Document

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)
