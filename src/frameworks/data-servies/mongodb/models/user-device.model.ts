import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema()
export class UserDevice {
  _id: string

  @Prop({ required: true })
  device_id: string

  @Prop({ required: true })
  device_name: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: string

  @Prop({ required: true })
  created_at: number
}

export type UserDeviceDocument = UserDevice & Document

export const UserDeviceSchema = SchemaFactory.createForClass(UserDevice)
