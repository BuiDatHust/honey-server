import { Expose } from '@nestjs/class-transformer'
import { HttpStatus } from '@nestjs/common'
import { ApiExtraModels, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type, instanceToPlain } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'

@ApiExtraModels()
export class PaginationData<T> {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  has_more?: boolean

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  next_cursor?: T
}

export class PaginationResponse<T, Q> {
  @ApiProperty()
  data: T

  @Expose({ name: 'status_code' })
  statusCode: number

  @Expose()
  message: string

  @Expose()
  timestamp: string

  @ApiProperty({ type: PaginationData })
  @Type(() => PaginationData)
  @ValidateNested()
  pagination: PaginationData<Q>

  constructor(
    data: T,
    pagination: PaginationData<Q>,
    statusCode = HttpStatus.OK,
    message = 'successfully',
  ) {
    this.data = data
    this.pagination = pagination
    this.statusCode = statusCode
    this.message = message
    this.timestamp = getCurrentMilisecondTime().toString()
  }

  static toPlain() {
    return instanceToPlain(this)
  }
}
