import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema()
export class UserDevice {
  _id: Types.ObjectId

  @Prop()
  device_id: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId

  @Prop({ required: true })
  created_at: number
}

export type UserDeviceDocument = UserDevice & Document

export const UserDeviceSchema = SchemaFactory.createForClass(UserDevice)
