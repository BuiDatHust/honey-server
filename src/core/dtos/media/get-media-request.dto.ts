import { Expose } from '@nestjs/class-transformer'
import { IsNotEmpty } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetMediaRequestDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  bucket_name: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  object_name: string
}
