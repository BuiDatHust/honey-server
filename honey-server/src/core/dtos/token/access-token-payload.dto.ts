import { Expose } from '@nestjs/class-transformer'
import { IsEnum, IsNotEmpty } from '@nestjs/class-validator'
import { TOKEN_TYPE } from '@use-cases/token/constant/token.constant'

export class AccessTokenPayloadDto {
  @Expose()
  @IsNotEmpty()
  email: string

  @Expose()
  @IsNotEmpty()
  device_id: string

  @Expose()
  @IsNotEmpty()
  @IsEnum(TOKEN_TYPE)
  type_token: string

  @Expose()
  @IsNotEmpty()
  phone_number: string

  @Expose()
  @IsNotEmpty()
  country_code: string

  @Expose()
  @IsNotEmpty()
  user_id: string
}
