import { Otp } from '@frameworks/data-servies/mongodb/models/otp.model'
import { Injectable } from '@nestjs/common'
import { CreateOtpDto } from '@use-cases/otp/dto/create-otp.dto'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'

@Injectable()
export class OtpFactoryService {
  constructor() {}

  createNewOtp(data: CreateOtpDto): Otp {
    const otpModel = new Otp()

    otpModel.code = data.code
    otpModel.type_otp = data.type_otp
    otpModel.expire_at = data.expire_at
    otpModel.created_at = getCurrentMilisecondTime()
    if (data.phone_number) {
      otpModel.phone_number = data.phone_number
    }
    if (data.email) {
      otpModel.email = data.email
    }
    otpModel.otp_usecase = data.otp_usecase

    return otpModel
  }
}
