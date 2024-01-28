import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from 'class-validator'

export class CompleteOrderRequestDto {
  @Expose()
  @IsNotEmpty()
  order_id: string
}
