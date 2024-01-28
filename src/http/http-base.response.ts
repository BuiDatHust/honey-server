import { Expose } from '@nestjs/class-transformer'
import { HttpStatus } from '@nestjs/common'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'

export class HttpBaseResponse<T> {
  @Expose({ name: 'status_code' })
  statusCode: number

  @Expose()
  message: string

  @Expose()
  timestamp: string

  @Expose()
  data: T

  constructor(data: T, statusCode = HttpStatus.OK, msg = 'successfully') {
    this.statusCode = statusCode
    this.message = msg
    this.timestamp = getCurrentMilisecondTime().toString()
    this.data = data
  }
}
