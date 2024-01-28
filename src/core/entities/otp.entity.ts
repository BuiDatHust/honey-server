export class OtpEntity {
  _id: string
  email?: string
  phone_number?: string
  code?: string
  expire_at?: number
  type_otp?: string
  otp_usecase?: string
  created_at?: number
  updated_at?: number
}
