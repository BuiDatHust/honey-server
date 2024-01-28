import { TYPE_MATCH_MAKING } from '@frameworks/data-servies/mongodb/constant/match-making.constant'
import { Expose } from 'class-transformer'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class SpeedUpMatchMakingRequestDto {
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
