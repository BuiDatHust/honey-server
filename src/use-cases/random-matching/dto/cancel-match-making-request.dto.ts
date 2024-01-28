import { TYPE_MATCH_MAKING } from '@frameworks/data-servies/mongodb/constant/match-making.constant'
import { Expose } from '@nestjs/class-transformer'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class CancelMatchMakingRequestDto {
  @Expose()
  @IsNotEmpty()
  @IsEnum(TYPE_MATCH_MAKING)
  type_match_making: string
}
