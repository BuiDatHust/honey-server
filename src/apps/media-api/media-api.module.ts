import { ConfigurationModule } from '@configuration/configuration.module'
import { MinioClientModule } from '@frameworks/media-storage-services/minio/minio-client.module'
import { Module } from '@nestjs/common'
import { LoggerServiceModule } from '@services/logger-services/logger-services.module'
import { FileUseCasesModule } from '@use-cases/file/file.module'
import { FileUploadController } from './controller/file-upload.controller'
import { MediaController } from './controller/media.controller'

@Module({
  imports: [
    LoggerServiceModule,
    ConfigurationModule.forRoot(),
    MinioClientModule,
    FileUseCasesModule,
  ],
  controllers: [FileUploadController, MediaController],
  providers: [],
})
export class MediaApiModule {}
