import { ConfigurationService } from '@configuration/configuration.service'
import { IMediaStorageServices } from '@core/abstracts/media-storage-services.abstract'
import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import { MinioService } from 'nestjs-minio-client'
import { BufferedFile } from '../interface/file.interface'
import { MinioConfig } from '../interface/minio-config.interface'

@Injectable()
export class MinioClientService implements IMediaStorageServices {
  private readonly baseBucket = ''

  public get client() {
    return this.minio.client
  }

  constructor(
    private readonly minio: MinioService,
    private readonly configService: ConfigurationService,
  ) {
    this.baseBucket = this.configService.get('minio.bucket')
  }

  public async upload(file: BufferedFile, baseBucket = this.baseBucket) {
    let temp_filename = Date.now().toString()
    let hashedFileName = crypto.createHash('md5').update(temp_filename).digest('hex')
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    )
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    }
    let filename = hashedFileName + ext
    const fileName: string = `${filename}`
    const fileBuffer = file.buffer
    const result = await this.minio.client.putObject(baseBucket, fileName, fileBuffer, metaData)
    console.log(result)

    const url = this._getUploadUrl(fileName)
    return {
      url,
    }
  }

  public async uploadStreamByChunk(stream, baseBucket = this.baseBucket) {
    const chunkStream = new this.minio.client.ChunkedStream({
      stream: stream,
      chunkSize: 1024 * 1024 * 5, // 5 MB chunk size
    })
    const result = await this.minio.client.putObject(baseBucket, 'filename', chunkStream)
    return result
  }

  private _getUploadUrl(filename: string): string {
    const minioConfig = this.configService.get<MinioConfig>('minio')
    const { end_point, port, bucket } = minioConfig

    return `${end_point}:${port}/${bucket}/${filename}`
  }
}
