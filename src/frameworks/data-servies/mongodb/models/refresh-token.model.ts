import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class RefreshToken {
  _id: string

  @Prop({ required: true })
  refresh_token: string

  @Prop({ required: true })
  device_id: string

  @Prop({ default: false })
  is_expired?: boolean

  @Prop({ required: true })
  expire_at: number

  @Prop({ required: true })
  created_at: number
}

export type RefreshTokenDocument = RefreshToken & Document

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)
