import { Expose } from '@nestjs/class-transformer'
import { IsOptional } from 'class-validator'

export class GetListFriendRequestDto {
  @Expose()
  @IsOptional()
  is_get_recently_match: boolean

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
