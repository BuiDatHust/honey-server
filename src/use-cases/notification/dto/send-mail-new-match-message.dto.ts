import { Expose } from '@nestjs/class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class SendMailNewMatchMessageDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  new_friend_id: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  user_id: string
}
