import { SUBSCRIPTION_TYPE } from '@frameworks/data-servies/mongodb/constant/subscription.constant'
import { Expose } from '@nestjs/class-transformer'
import { SUBSCRIPTION_DURATION } from '@use-cases/subscription/constant/subscription.constant'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export class RegiterSubscriptionRequestDto {
  @Expose()
  @IsNotEmpty()
  @IsEnum(SUBSCRIPTION_TYPE)
  type_subscription: string

  @Expose()
  @IsOptional()
  is_auto_extend?: boolean

  @Expose()
  @IsOptional()
  @IsEnum(SUBSCRIPTION_DURATION)
  duration: string
}
