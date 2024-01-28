import { TYPE_OTP } from '@frameworks/data-servies/mongodb/constant/otp.constant'
import { Expose } from '@nestjs/class-transformer'
import { IsEnum, IsNotEmpty } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SendSmsOtpDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  phone_number: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  country_code: string

  @ApiProperty()
  @Expose({})
  @IsNotEmpty()
  @IsEnum(TYPE_OTP)
  otp_usecase: string
}
