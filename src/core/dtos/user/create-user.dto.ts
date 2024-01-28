import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from '@nestjs/class-validator'

export class CreateUserDto {
  @Expose()
  @IsNotEmpty()
  country_code: string

  @Expose()
  @IsNotEmpty()
  phone_number: string
}
