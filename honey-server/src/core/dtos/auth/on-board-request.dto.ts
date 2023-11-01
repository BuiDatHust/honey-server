import {
  GENDER,
  MAX_TOTAL_MEDIA,
  MIN_TOTAL_MEDIA,
  PASSIONS,
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
import { MediaDto } from '../media/media.dto'
import { LocationDto } from '../user/location.dto'

export class OnboardRequestDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  country_code: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  phone_number: string

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
  sexual_orientation: SEXUAL_ORIENTATION

  @ApiProperty({
    enum: GENDER,
    description: 'Gender',
  })
  @Expose()
  @IsEnum(GENDER)
  @IsNotEmpty()
  gender: string

  @ApiProperty({
    enum: GENDER,
    description: 'Gender show',
  })
  @IsEnum(GENDER)
  @Expose()
  @IsNotEmpty()
  gender_show: string

  @ApiProperty({
    enum: PASSIONS,
    isArray: true,
    description: 'List of passion',
  })
  @IsEnum(PASSIONS, { each: true })
  @Expose()
  @IsNotEmpty()
  passions: PASSIONS[]

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Type(() => MediaDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(MIN_TOTAL_MEDIA)
  @ArrayMaxSize(MAX_TOTAL_MEDIA)
  media: MediaDto[]

  @ApiPropertyOptional({
    description: 'List of enums',
    isArray: true,
    enum: USER_FIELDS,
  })
  @Expose()
  @IsOptional()
  @IsEnum(USER_FIELDS, { each: true })
  visualization_fields?: USER_FIELDS[]

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  is_show_notification?: boolean

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @Type(() => LocationDto)
  location?: LocationDto
}
