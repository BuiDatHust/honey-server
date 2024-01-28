import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { OTP_USECASE, TYPE_OTP } from '../constant/otp.constant'

@Schema()
export class Otp {
  _id?: string

  @Prop()
  email?: string

  @Prop()
  phone_number?: string

  @Prop({ required: true })
  code: string

  @Prop({ required: true })
  expire_at: number

  @Prop({ required: true, enum: TYPE_OTP })
  type_otp: string

  @Prop({ required: true, enum: OTP_USECASE })
  otp_usecase: string

  @Prop({ required: true })
  created_at: number

  @Prop({})
  updated_at?: number
}

export type OtpDocument = Otp & Document

export const OtpSchema = SchemaFactory.createForClass(Otp)
