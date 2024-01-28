import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from '@nestjs/class-validator'

export class CreateRefreshTokenDto {
  @Expose()
  @IsNotEmpty()
  refresh_token: string

  @Expose()
  @IsNotEmpty()
  device_id: string

  @Expose()
  @IsNotEmpty()
  expire_at: number

  @Expose()
  @IsNotEmpty()
  type_source_refresh_token: string
}
