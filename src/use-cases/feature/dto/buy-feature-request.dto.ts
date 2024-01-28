import { FEATURE } from '@frameworks/data-servies/mongodb/constant/feature.constant'
import { IsEnum } from '@nestjs/class-validator'
import { Expose } from 'class-transformer'
import { IsNotEmpty, Min } from 'class-validator'

export class BuyFeatureRequestDto {
  @Expose()
  @IsNotEmpty()
  @IsEnum(FEATURE)
  type_feature: string

  @Expose()
  @IsNotEmpty()
  @Min(1)
  num_of_feature_usage: number
}
