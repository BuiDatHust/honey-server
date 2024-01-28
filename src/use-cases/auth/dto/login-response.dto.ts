import { Expose } from '@nestjs/class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class LoginResponseDto {
  @ApiProperty()
  @Expose()
  access_token: string

  @ApiProperty()
  @Expose()
  refresh_token: string
}
