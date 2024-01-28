import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class SendInAppLoyaltyMessageDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  user_id: string
}
