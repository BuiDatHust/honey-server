import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from '@nestjs/class-validator'

export class CreateUserDeviceDto {
  @Expose()
  @IsNotEmpty()
  user_id: string

  @Expose()
  @IsNotEmpty()
  device_id: string

  @Expose()
  @IsNotEmpty()
  device_name: string
}
