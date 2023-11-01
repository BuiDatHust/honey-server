import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from '@nestjs/class-validator'

export class MediaDto {
  @Expose()
  @IsNotEmpty()
  url: string

  @Expose()
  @IsNotEmpty()
  width: number

  @Expose()
  @IsNotEmpty()
  height: number
}
