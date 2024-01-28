import { SUBSCRIPTION_TYPE } from '@frameworks/data-servies/mongodb/constant/subscription.constant'
import {
  SUBSCRIPTION_DURATION,
} from '@use-cases/subscription/constant/subscription.constant'
import { Expose } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export class UpgradeSubscriptionRequestDto {
  @Expose()
  @IsNotEmpty()
  subscription_id: string

  @Expose()
  @IsNotEmpty()
  @IsEnum(SUBSCRIPTION_TYPE)
  type_subscription: string

  @Expose()
  @IsOptional()
  is_auto_extend?: boolean

  @Expose()
  @IsNotEmpty()
  @IsEnum(SUBSCRIPTION_DURATION)
  duration: string
}
