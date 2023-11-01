import { TYPE_OTP } from '@frameworks/data-servies/mongodb/constant/otp.constant'
import { Expose } from '@nestjs/class-transformer'
import { IsEnum, IsNotEmpty, ValidateIf } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class VerifyOtpDto {
  @Expose()
  @IsNotEmpty()
  @ValidateIf(val => val.type_otp === TYPE_OTP.PHONE)
  phone?: string

  @Expose()
  @IsNotEmpty()
  @ValidateIf(val => val.type_otp === TYPE_OTP.PHONE)
  email?: string

  @Expose()
  @IsNotEmpty()
  type_otp: string

  @Expose()
  @IsNotEmpty()
  code: string

  @ApiProperty()
  @Expose({})
  @IsNotEmpty()
  @IsEnum(TYPE_OTP)
  otp_usecase: string
}
