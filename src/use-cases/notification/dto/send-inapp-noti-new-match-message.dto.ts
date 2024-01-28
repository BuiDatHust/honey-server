import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class SendInAppNotiNewMessageMessageDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  chat_id: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  user_id: string
}
