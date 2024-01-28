import { Expose } from '@nestjs/class-transformer'
import { IsBoolean, IsOptional } from '@nestjs/class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class SuccessResponse {
  @ApiPropertyOptional({
    name: 'success',
  })
  @Expose({ name: 'success' })
  @IsBoolean()
  @IsOptional()
  success?: boolean
}
