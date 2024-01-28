import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty, MaxLength } from 'class-validator'

export class SetStatusRequestDto {
  @Expose()
  @IsNotEmpty()
  @MaxLength(200)
  status: string
}
