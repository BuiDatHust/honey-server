import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ReactProfileResponse {
  @ApiProperty()
  @Expose()
  is_matching: boolean
}
