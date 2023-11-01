import { ConfigurationModule } from '@configuration/configuration.module'
import { ConfigurationService } from '@configuration/configuration.service'
import { IMediaStorageServices } from '@core/abstracts/media-storage-services.abstract'
import { Module } from '@nestjs/common'
import { MinioModule } from 'nestjs-minio-client'
import { MinioClientService } from './minio-client.service'

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: (config: ConfigurationService) => {
        return {
          endPoint: config.get('minio.end_point'),
          port: parseInt(config.get('minio.port')),
          useSSL: false,
          accessKey: config.get('minio.access_key'),
          secretKey: config.get('minio.secret_key'),
        }
      },
    }),
  ],
  providers: [
    {
      provide: IMediaStorageServices,
      useClass: MinioClientService,
    },
  ],
  exports: [IMediaStorageServices],
})
export class MinioClientModule {}
