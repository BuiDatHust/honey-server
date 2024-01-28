import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from 'class-validator'

export class MatchMakingMessageDto {
  @Expose()
  @IsNotEmpty()
  user_id: string

  @Expose()
  @IsNotEmpty()
  match_making_request_id: string
}
