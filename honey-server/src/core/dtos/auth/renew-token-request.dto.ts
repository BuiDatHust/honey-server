import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RenewTokenRequestDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  refresh_token: string
}
