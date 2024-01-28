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
  ) {}

  public async upload(file: BufferedFile, baseBucket: string) {
    const temp_filename = Date.now().toString()
    const hashedFileName = crypto.createHash('md5').update(temp_filename).digest('hex')
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    )
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    }
    const filename = hashedFileName + ext
    const fileName: string = `${filename}`
    const fileBuffer = file.buffer
    await this.minio.client.putObject(baseBucket, fileName, fileBuffer, metaData)

    const url = this._getUploadUrl(baseBucket, fileName)
    return {
      url,
    }
  }

  public async get(bucketName: string, objectName: string) {
    return this.minio.client.getObject(bucketName, objectName)
  }

  public async uploadStreamByChunk(stream, baseBucket = this.baseBucket) {
    const chunkStream = new this.minio.client.ChunkedStream({
      stream: stream,
      chunkSize: 1024 * 1024 * 5, // 5 MB chunk size
    })
    const result = await this.minio.client.putObject(baseBucket, 'filename', chunkStream)
    return result
  }

  private _getUploadUrl(bucket: string, filename: string): string {
    const apiPort = this.configService.get<MinioConfig>('media_api_port')
    const domain = this.configService.get<MinioConfig>('domain')
    const host = `${domain}:${apiPort}`

    return `http://${host}/media-api/media/?bucket_name=${bucket}&object_name=${filename}`
  }
}
