import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class TokenResponseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  access_token: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  refresh_token: string
}
