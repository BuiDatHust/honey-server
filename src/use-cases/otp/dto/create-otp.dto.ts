import { OTP_USECASE, TYPE_OTP } from '@frameworks/data-servies/mongodb/constant/otp.constant'
import { Expose } from '@nestjs/class-transformer'
import { IsEnum, IsNotEmpty, IsOptional } from '@nestjs/class-validator'

export class CreateOtpDto {
  @Expose()
  @IsOptional()
  email?: string

  @Expose()
  @IsOptional()
  phone_number?: string

  @Expose({})
  @IsNotEmpty()
  code: string

  @Expose({})
  @IsNotEmpty()
  expire_at: number

  @Expose({})
  @IsNotEmpty()
  @IsEnum(TYPE_OTP)
  type_otp: string

  @Expose({})
  @IsNotEmpty()
  @IsEnum(OTP_USECASE)
  otp_usecase: string
}
