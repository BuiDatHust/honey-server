import { USER_STATUS } from '@frameworks/data-servies/mongodb/constant/user.constant'
import { Expose } from '@nestjs/class-transformer'
import { IsEnum, IsNotEmpty } from '@nestjs/class-validator'
import { OnboardRequestDto } from '@use-cases/auth/dto/on-board-request.dto'

export class UpdateUserOnboardingDto extends OnboardRequestDto {
  @Expose()
  @IsNotEmpty()
  id: string

  @Expose()
  @IsEnum(USER_STATUS)
  @IsNotEmpty()
  status: string

  @Expose()
  @IsNotEmpty()
  account_setting: string

  @Expose()
  @IsNotEmpty()
  search_setting: string

  @Expose()
  @IsNotEmpty()
  notification_setting: string
}
