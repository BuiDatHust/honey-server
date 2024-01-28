import { OTP_USECASE, TYPE_OTP } from '@frameworks/data-servies/mongodb/constant/otp.constant'
import { Expose } from '@nestjs/class-transformer'
import { IsEnum, IsNotEmpty, ValidateIf } from '@nestjs/class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SendOtpRequestDto {
  @ApiPropertyOptional()
  @Expose()
  @IsNotEmpty()
  @ValidateIf(val => val.type_otp === TYPE_OTP.EMAIL)
  email?: string

  @ApiPropertyOptional()
  @Expose()
  @IsNotEmpty()
  @ValidateIf(val => val.type_otp === TYPE_OTP.PHONE)
  phone_number?: string

  @ApiPropertyOptional()
  @Expose()
  @IsNotEmpty()
  @ValidateIf(val => val.type_otp === TYPE_OTP.PHONE)
  country_code?: string

  @ApiProperty()
  @Expose({})
  @IsNotEmpty()
  @IsEnum(TYPE_OTP)
  type_otp: TYPE_OTP

  @ApiProperty()
  @Expose({})
  @IsNotEmpty()
  @IsEnum(OTP_USECASE)
  otp_usecase: OTP_USECASE
}
