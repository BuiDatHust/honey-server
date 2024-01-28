import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from 'class-validator'

export class CreateOrderRequestDto {
  @Expose()
  @IsNotEmpty()
  value: number
}
