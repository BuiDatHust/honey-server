import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema()
export class Wallet {
  _id?: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id?: string | Types.ObjectId

  @Prop({ required: true })
  coin: number

  @Prop({ required: true })
  created_at: number

  @Prop({})
  updated_at?: number
}

export type WalletDocument = Wallet & Document

export const WalletSchema = SchemaFactory.createForClass(Wallet)
