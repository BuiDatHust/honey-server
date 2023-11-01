import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from '@nestjs/class-validator'
import { Types } from 'mongoose'

export class CreateUserDeviceDto {
  @Expose()
  @IsNotEmpty()
  user_id: Types.ObjectId

  @Expose()
  @IsNotEmpty()
  device_id?: string
}
