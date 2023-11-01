import { USER_STATUS } from '@frameworks/data-servies/mongodb/constant/user.constant'
import { Expose } from '@nestjs/class-transformer'
import { IsEnum, IsNotEmpty } from '@nestjs/class-validator'
import { Types } from 'mongoose'
import { OnboardRequestDto } from '../auth/on-board-request.dto'

export class UpdateUserOnboardingDto extends OnboardRequestDto {
  @Expose()
  @IsNotEmpty()
  id: Types.ObjectId

  @Expose()
  @IsEnum(USER_STATUS)
  @IsNotEmpty()
  status: string

  @Expose()
  @IsNotEmpty()
  account_setting: Types.ObjectId

  @Expose()
  @IsNotEmpty()
  search_setting: Types.ObjectId

  @Expose()
  @IsNotEmpty()
  notification_setting: Types.ObjectId
}
