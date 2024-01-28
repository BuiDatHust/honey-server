import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { TRANSACTION_STATUS, TYPE_TRANSACTION } from '../constant/transaction.constant'

@Schema()
export class Transaction {
  _id?: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id?: string | Types.ObjectId

  @Prop({ required: true })
  amount: number

  @Prop({ required: false })
  order_id?: string

  @Prop({ required: false })
  payout_id?: string

  @Prop({ required: false })
  capture_id?: string

  @Prop({ type: Types.ObjectId, ref: 'Subscription', required: false })
  subscription_id?: string | Types.ObjectId

  @Prop({ required: true, enum: TYPE_TRANSACTION })
  type_transaction: string

  @Prop({ required: true, enum: TRANSACTION_STATUS })
  status: string

  @Prop({ required: true })
  created_at: number

  @Prop({})
  updated_at?: number
}

export type TransactionDocument = Transaction & Document

export const TransactionSchema = SchemaFactory.createForClass(Transaction)
