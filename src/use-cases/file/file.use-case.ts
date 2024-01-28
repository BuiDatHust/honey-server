import { ConfigurationService } from '@configuration/configuration.service'
import { IMediaStorageServices } from '@core/abstracts/media-storage-services.abstract'
import {
  AppMimeType,
  BufferedFile,
} from '@frameworks/media-storage-services/interface/file.interface'
import { BadRequestException, Injectable } from '@nestjs/common'
import * as ffmpeg from 'fluent-ffmpeg'
import * as fs from 'fs'
import getVideoDurationInSeconds from 'get-video-duration'
import { PinoLogger } from 'nestjs-pino'
import * as sharp from 'sharp'
import { Readable } from 'stream'
import {
  MAX_AUDIO_FILE_SIZE,
  MAX_AUDIO_FILE_UPLOAD,
  MAX_IMAGE_FILE_UPLOAD,
  MAX_VIDEO_DURATION,
  MAX_VIDEO_UPLOAD,
} from './constant'

@Injectable()
export class FileUseCases {
  constructor(
    private readonly logger: PinoLogger,
    private readonly minioClientService: IMediaStorageServices,
    private readonly configService: ConfigurationService,
  ) {
    this.logger.setContext(FileUseCases.name)
  }

  public async uploadImages(files: BufferedFile[]) {
    this.logger.info('uploadImages')

    this.validateImageFile(files)
    const bucket = this.configService.get('minio.image_bucket') as string
    const urls = await Promise.all(files.map(file => this.minioClientService.upload(file, bucket)))
    const urlMetadata = await Promise.all(
      urls.map(async (url, index) => {
        const file = files[index]
        const metadata = await sharp(file.buffer).metadata()

        return {
          url: url.url,
          width: metadata.height,
          height: metadata.height,
        }
      }),
    )
    return urlMetadata
  }

  public async uploadVideo(files: Express.Multer.File[]) {
    this.logger.info('uploadVideo')
    try {
      const bufferFiles: BufferedFile[] = files.map(file => {
        return {
          fieldname: file.fieldname,
          originalname: file.originalname,
          encoding: file.encoding || '',
          mimetype: file.mimetype as AppMimeType,
          size: file.size,
          buffer: fs.readFileSync(file.path),
        }
      })

      await this.validateVideoFile(bufferFiles)
      const bucket = this.configService.get('minio.video_bucket') as string
      const urls = await Promise.all(
        bufferFiles.map(file => this.minioClientService.upload(file, bucket)),
      )
      const urlMetadata = await Promise.all(
        urls.map(async (url, index) => {
          const file = files[index]
          const fileData = await this.getVideoInfo(file.path)

          return {
            url: url.url,
            width: fileData.streams[0]?.height,
            height: fileData.streams[0]?.height,
          }
        }),
      )

      files.forEach(file => {
        fs.unlinkSync(file.path)
      })
      return urlMetadata
    } catch (error) {
      files.forEach(file => {
        fs.unlinkSync(file.path)
      })

      this.logger.error({ error })
      throw error
    }
  }

  public async uploadAudio(files: BufferedFile[]) {
    this.logger.info('uploadAudio')

    this.validateAudioFile(files)
    const bucket = this.configService.get('minio.audio_bucket') as string
    const urls = await Promise.all(files.map(file => this.minioClientService.upload(file, bucket)))
    const urlMetadata = await Promise.all(
      urls.map(url => {
        return {
          url: url.url,
        }
      }),
    )
    return urlMetadata
  }

  public async getMedia(bucketName: string, objectName: string) {
    const media = await this.minioClientService.get(bucketName, objectName)
    return media
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

  public async validateVideoFile(files: BufferedFile[]): Promise<boolean> {
    if (files.length > MAX_VIDEO_UPLOAD) {
      throw new BadRequestException(`Total video file must not greater than ${MAX_VIDEO_UPLOAD}`)
    }

    files.find(async file => {
      if (!this.validateVideoFileExtension(file.originalname)) {
        throw new BadRequestException('File extension is not correct!')
      }

      const duration = await getVideoDurationInSeconds(Readable.from(file.buffer))
      if (duration > MAX_VIDEO_DURATION) {
        throw new BadRequestException('File duration is not correct!')
      }
    })

    return true
  }

  public validateAudioFile(files: BufferedFile[]): boolean {
    if (files.length > MAX_AUDIO_FILE_UPLOAD) {
      throw new BadRequestException(
        `Total image file must not greater than ${MAX_AUDIO_FILE_UPLOAD}`,
      )
    }

    files.forEach(file => {
      if (!this.validateAudioFileExtension(file.originalname)) {
        throw new BadRequestException('File etension is not correct!')
      }

      if (file.size > MAX_AUDIO_FILE_SIZE) {
        throw new BadRequestException('File is to large!')
      }
    })

    return true
  }

  private validateImageFileExtension(fileExtension: string): boolean {
    return !!fileExtension.match(/^.*\.(jpg|webp|png|jpeg)$/)?.length
  }

  private validateVideoFileExtension(fileExtension: string): boolean {
    return !!fileExtension.match(/^.*\.(mp4|mov|flv|avi|webm|vlc)$/)?.length
  }

  private validateAudioFileExtension(fileExtension: string): boolean {
    return !!fileExtension.match(/^.*\.(mp3|wav|aac|flac)$/)?.length
  }

  private async getVideoInfo(file: string): Promise<ffmpeg.FfprobeData> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(file, (err, meta: ffmpeg.FfprobeData) => {
        if (err) {
          reject(err)
        } else {
          resolve(meta)
        }
      })
    })
  }
}
