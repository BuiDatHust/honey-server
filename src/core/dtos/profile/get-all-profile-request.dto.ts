import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class GetAllProfileRequestDto {
  @ApiProperty()
  @Expose()
  @IsOptional()
  cursor?: string

  @ApiProperty()
  @Expose()
  @IsOptional()
  limit?: number
}
