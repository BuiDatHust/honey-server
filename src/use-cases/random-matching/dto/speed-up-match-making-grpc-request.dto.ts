import { TYPE_MATCH_MAKING } from '@frameworks/data-servies/mongodb/constant/match-making.constant'
import { Expose } from '@nestjs/class-transformer'
import { IsEnum } from '@nestjs/class-validator'
import { IsNotEmpty } from 'class-validator'

export class SpeedUpMatchMakingGrpcRequestDto {
  @Expose()
  @IsNotEmpty()
  user_id: string

  @Expose()
  @IsNotEmpty()
  speed_up_level: number

  @Expose()
  @IsNotEmpty()
  match_making_request_id: string

  @Expose()
  @IsNotEmpty()
  @IsEnum(TYPE_MATCH_MAKING)
  type_match_making: string
}
