import { Expose, Type } from '@nestjs/class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class SendMailPropety<T> {
  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  from?: string

  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  to: string

  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  template: string

  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  subject: string

  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  context: T
}
