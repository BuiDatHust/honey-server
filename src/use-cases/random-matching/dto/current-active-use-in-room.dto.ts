import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from 'class-validator'

export class CurrentActiveUseInRoomDto {
  @Expose()
  @IsNotEmpty()
  total_user_in_chat_room: number

  @Expose()
  @IsNotEmpty()
  total_user_in_voice_room: number
}
