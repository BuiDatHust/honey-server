import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { Public } from '@decorators/public.decorator'
import { BufferedFile } from '@frameworks/media-storage-services/interface/file.interface'
import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'
import { MAX_VIDEO_UPLOAD } from '@use-cases/file/constant'
import { FileUseCases } from '@use-cases/file/file.use-case'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { HttpBaseResponse } from 'src/http/http-base.response'

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
    this.logger.info('uploadImages')

    if (!files?.length) {
      throw new BadRequestException('files is not empty!')
    }
    const result = await this.fileUseCases.uploadImages(files)
    return new HttpBaseResponse(result)
  }

  @Public()
  @Post('video')
  @UseInterceptors(
    FilesInterceptor('files', MAX_VIDEO_UPLOAD, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          cb(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
    }),
  )
  async uploadVideo(@UploadedFiles() files: Express.Multer.File[]) {
    this.logger.info('uploadVideo')

    if (!files?.length) {
      throw new BadRequestException('files is not empty!')
    }
    const result = await this.fileUseCases.uploadVideo(files)
    return new HttpBaseResponse(result)
  }

  @Public()
  @Post('audio')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadAudio(@UploadedFiles() files: BufferedFile[]) {
    this.logger.info('uploadAudio')

    if (!files?.length) {
      throw new BadRequestException('files is not empty!')
    }
    const result = await this.fileUseCases.uploadAudio(files)
    return new HttpBaseResponse(result)
  }
}
