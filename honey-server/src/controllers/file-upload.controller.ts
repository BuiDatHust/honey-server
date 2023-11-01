import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { Public } from '@decorators/public.decorator'
import { BufferedFile } from '@frameworks/media-storage-services/interface/file.interface'
import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'
import { FileUseCases } from '@use-cases/file/file.use-case'

@ApiTags('upload')
@Controller('upload')
export class FileUploadController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly fileUseCases: FileUseCases,
  ) {
    this.logger.setContext(FileUploadController.name)
  }

  @Public()
  @Post('image')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(@UploadedFiles() files: BufferedFile[]) {
    this.logger.debug('uploadImages')
    const result = await this.fileUseCases.uploadImages(files)
    return result
  }
}
