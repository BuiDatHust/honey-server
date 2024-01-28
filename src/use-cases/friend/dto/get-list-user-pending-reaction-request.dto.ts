import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from '@nestjs/class-validator'
import { PENDING_REACTION_TYPE } from '@use-cases/friend/constant/friend.constant'
import { IsEnum, IsOptional } from 'class-validator'

export class GetListUserPendingReactionRequestDto {
  @Expose()
  @IsNotEmpty()
  @IsEnum(PENDING_REACTION_TYPE)
  type_pending: string

  @Expose()
  @IsOptional()
  cursor?: string

  @Expose()
  @IsOptional()
  limit?: number

  @Expose()
  @IsOptional()
  order?: number
}
