import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty, IsOptional } from '@nestjs/class-validator'
import { Types } from 'mongoose'

export class CreateAccountSettingDto {
  @Expose()
  @IsNotEmpty()
  user_id: Types.ObjectId

  @Expose()
  @IsOptional()
  language?: string

  @Expose()
  @IsOptional()
  unit_distance?: string
}
