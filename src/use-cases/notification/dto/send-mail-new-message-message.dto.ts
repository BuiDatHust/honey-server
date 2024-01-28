import { Expose } from '@nestjs/class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class SendMailNewChatMessageDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  chat_id: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  user_id: string
}
