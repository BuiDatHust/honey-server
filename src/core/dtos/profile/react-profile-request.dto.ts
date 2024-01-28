import { Expose } from '@nestjs/class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { TYPE_MATCHING, TYPE_REACTION } from '@use-cases/user/constant/user.constant'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class ReactProfileRequestDto {
  @ApiProperty()
  @Expose()
  @IsEnum(TYPE_MATCHING)
  @IsNotEmpty()
  type_matching: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  user_id: string

  @ApiProperty()
  @Expose()
  @IsEnum(TYPE_REACTION)
  @IsNotEmpty()
  type_reaction: string
}
