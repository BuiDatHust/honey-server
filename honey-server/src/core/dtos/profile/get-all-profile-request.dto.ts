import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class GetAllProfileRequestDto {
  @ApiProperty()
  @Expose()
  cursor?: string

  @ApiProperty()
  @Expose()
  limit: number
}
