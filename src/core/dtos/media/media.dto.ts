import { Expose } from '@nestjs/class-transformer'
import { IsOptional } from '@nestjs/class-validator'

export class MediaDto {
  @Expose()
  @IsOptional()
  url?: string

  @Expose()
  @IsOptional()
  width?: number

  @Expose()
  @IsOptional()
  height?: number
}
