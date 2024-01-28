import { Expose } from '@nestjs/class-transformer'
import { IsOptional } from '@nestjs/class-validator'

export class CreateEmailSettingDto {
  @Expose()
  @IsOptional()
  is_send_new_match?: boolean

  @Expose()
  @IsOptional()
  is_send_new_message?: boolean
}
