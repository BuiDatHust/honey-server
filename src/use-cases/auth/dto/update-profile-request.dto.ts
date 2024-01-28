import { MediaDto } from '@core/dtos/media/media.dto'
import {
  GENDER,
  MAX_TOTAL_MEDIA,
  MIN_TOTAL_MEDIA,
  PASSIONS,
  RELATIONSHIP_GOAL,
  SEXUAL_ORIENTATION,
  USER_FIELDS,
} from '@frameworks/data-servies/mongodb/constant/user.constant'
import { Expose, Type } from '@nestjs/class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from '@nestjs/class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateProfileRequestDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  first_name: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  dob: number

  @ApiProperty({
    enum: SEXUAL_ORIENTATION,
    description: 'Sexual orientation',
  })
  @Expose()
  @IsNotEmpty()
  @IsEnum(SEXUAL_ORIENTATION)
  sexual_orientation: string

  @ApiProperty({
    enum: SEXUAL_ORIENTATION,
    description: 'Relationship goal',
  })
  @Expose()
  @IsOptional()
  @IsEnum(RELATIONSHIP_GOAL)
  relationship_goal?: string

  @ApiProperty({
    enum: GENDER,
    description: 'Gender',
  })
  @Expose()
  @IsEnum(GENDER)
  @IsNotEmpty()
  gender: string

  // @ApiProperty({
  //   enum: GENDER,
  //   description: 'Gender show',
  // })
  // @IsEnum(GENDER)
  // @Expose()
  // @IsNotEmpty()
  // gender_show: string

  @ApiProperty({
    enum: PASSIONS,
    isArray: true,
    description: 'List of passion',
  })
  @IsEnum(PASSIONS, { each: true })
  @Expose()
  @IsNotEmpty()
  passions: string[]

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Type(() => MediaDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(MIN_TOTAL_MEDIA)
  @ArrayMaxSize(MAX_TOTAL_MEDIA)
  medias: MediaDto[]

  @ApiPropertyOptional({
    description: 'List of enums',
    isArray: true,
    enum: USER_FIELDS,
  })
  @Expose()
  @IsOptional()
  @IsEnum(USER_FIELDS, { each: true })
  hide_fields?: string[]

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @Type(() => Number)
  coordinates?: number[]

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  company?: string

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  job_title?: string

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  address?: string

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  languages?: string

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  message_status?: string
}
