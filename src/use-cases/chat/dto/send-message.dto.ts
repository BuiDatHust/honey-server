import { TYPE_CONTENT, TYPE_MESSAGE } from '@frameworks/data-servies/mongodb/constant/chat.constant'
import { Expose } from '@nestjs/class-transformer'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class SendMessageDto {
  @Expose()
  @IsNotEmpty()
  user_id: string

  @Expose()
  @IsNotEmpty()
  chat_id: string

  @Expose()
  @IsNotEmpty()
  content: string

  @Expose()
  @IsNotEmpty()
  @IsEnum(TYPE_CONTENT)
  type_content: string

  @Expose()
  @IsNotEmpty()
  @IsEnum(TYPE_MESSAGE)
  type_message: string

  @Expose()
  @IsNotEmpty()
  access_token: string
}
