import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { GetMediaRequestDto } from '@core/dtos/media/get-media-request.dto'
import { Public } from '@decorators/public.decorator'
import { Controller, Get, Query, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FileUseCases } from '@use-cases/file/file.use-case'
import type { Response } from 'express'

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly fileUseCases: FileUseCases,
  ) {
    this.logger.setContext(MediaController.name)
  }

  @Public()
  @Get('')
  async getMedia(@Res() res: Response, @Query() query: GetMediaRequestDto) {
    this.logger.debug({ query }, 'getMedia')

    const result = await this.fileUseCases.getMedia(query.bucket_name, query.object_name)
    result.pipe(res)
  }
}
