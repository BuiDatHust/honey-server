import { Expose } from '@nestjs/class-transformer'
import { IsEnum, IsNotEmpty } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { LOG_OUT_TYPE } from '@use-cases/auth/constant/auth.constant'

export class LogoutRequestDto {
  @ApiProperty({ enum: LOG_OUT_TYPE })
  @Expose()
  @IsNotEmpty()
  @IsEnum(LOG_OUT_TYPE)
  logout_type: string
}
