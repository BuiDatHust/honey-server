import { Expose } from '@nestjs/class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class SendMailMktLoyaltyCoinMessage {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  coin: number

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  user_id: string
}
