import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class AccessToken {
  _id?: string

  @Prop({ required: true })
  access_token: string

  @Prop({ required: true })
  device_id: string

  @Prop({ required: true })
  created_at: number
}

export type AccessTokenDocument = AccessToken & Document

export const AccessTokenSchema = SchemaFactory.createForClass(AccessToken)
