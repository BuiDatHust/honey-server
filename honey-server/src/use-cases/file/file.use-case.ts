import { IMediaStorageServices } from '@core/abstracts/media-storage-services.abstract'
import { BufferedFile } from '@frameworks/media-storage-services/interface/file.interface'
import { BadRequestException, Injectable } from '@nestjs/common'
import { PinoLogger } from 'nestjs-pino'
import * as sharp from 'sharp'
import { MAX_IMAGE_FILE_UPLOAD } from './constant'

@Injectable()
export class FileUseCases {
  constructor(
    private readonly logger: PinoLogger,
    private readonly minioClientService: IMediaStorageServices,
  ) {
    this.logger.setContext(FileUseCases.name)
  }

  public async uploadImages(files: BufferedFile[]) {
    this.logger.info('uploadImages')

    this.validateImageFile(files)
    const urls = await Promise.all(files.map(file => this.minioClientService.upload(file)))
    const urlMetadata = await Promise.all(
      urls.map(async (url, index) => {
        const file = files[index]
        const metadata = await sharp(file.buffer).metadata()

        return {
          url,
          width: metadata.height,
          height: metadata.height,
        }
      }),
    )
    return urlMetadata
  }

  public validateImageFile(files: BufferedFile[]): boolean {
    if (files.length > MAX_IMAGE_FILE_UPLOAD) {
      throw new BadRequestException(
        `Total image file must not greater than ${MAX_IMAGE_FILE_UPLOAD}`,
      )
    }

    const isExistInValidateFileExtension = files.find(
      file => !this.validateImageFileExtension(file.originalname),
    )
    if (isExistInValidateFileExtension) {
      throw new BadRequestException('File etension is not correct!')
    }

    return true
  }

  public validateImageFileExtension(fileExtension: string): boolean {
    return !!fileExtension.match(/^.*\.(jpg|webp|png|jpeg)$/)?.length
  }
}
