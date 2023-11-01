import { Expose } from '@nestjs/class-transformer'
import { HttpStatus } from '@nestjs/common'
import { ApiExtraModels, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type, instanceToPlain } from 'class-transformer'
import { IsNumber, IsOptional, ValidateNested } from 'class-validator'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'

@ApiExtraModels()
export class PaginationData {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  has_more?: boolean

  @ApiPropertyOptional()
  @Expose()
  @IsNumber()
  @IsOptional()
  next_cursor?: number
}

export class PaginationResponse<T> {
  @ApiProperty()
  data: T

  @Expose({ name: 'status_code' })
  statusCode: number

  @Expose()
  msg: string

  @Expose()
  timestamp: string

  @ApiProperty({ type: PaginationData })
  @Type(() => PaginationData)
  @ValidateNested()
  pagination: PaginationData

  constructor(
    data: T,
    pagination: PaginationData,
    statusCode = HttpStatus.OK,
    msg = 'successfully',
  ) {
    this.data = data
    this.pagination = pagination
    this.statusCode = statusCode
    this.msg = msg
    this.timestamp = getCurrentMilisecondTime().toString()
  }

  static toPlain() {
    return instanceToPlain(this)
  }
}
