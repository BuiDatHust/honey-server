import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class SendInAppNotiNewMatchMessageDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  user_match_id: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  user_id: string
}
