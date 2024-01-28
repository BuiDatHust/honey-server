import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LocationDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  lat: number

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  long: number
}
