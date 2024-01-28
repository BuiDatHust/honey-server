import { Expose } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class GetListMessageInChatRequestDto {
  @Expose()
  @IsOptional()
  cursor?: string

  @Expose()
  @IsOptional()
  limit?: number

  @Expose()
  @IsOptional()
  order?: number
}
