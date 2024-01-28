import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty, IsOptional } from '@nestjs/class-validator'

export class CreateAccountSettingDto {
  @Expose()
  @IsNotEmpty()
  user_id: string

  @Expose()
  @IsOptional()
  language?: string

  @Expose()
  @IsOptional()
  unit_distance?: string
}
