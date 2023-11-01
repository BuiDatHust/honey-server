import { Expose } from '@nestjs/class-transformer'
import { IsEnum, IsNotEmpty } from '@nestjs/class-validator'
import { TOKEN_TYPE } from '@use-cases/token/constant/token.constant'

export class RefreshTokenPayloadDto {
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
}
