import { COMPLAINT_REASON } from '@frameworks/data-servies/mongodb/constant/complaint.constant'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsEnum } from 'class-validator'

export class ComplaintRequestDto {
  @ApiProperty()
  @Expose()
  user_id: string

  @ApiProperty()
  @Expose()
  @IsEnum(COMPLAINT_REASON)
  reason: string

  @ApiPropertyOptional()
  @Expose()
  reason_detail?: string
}
