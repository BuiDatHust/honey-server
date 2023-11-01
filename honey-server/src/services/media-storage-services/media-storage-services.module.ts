import { MinioClientModule } from '@frameworks/media-storage-services/minio/minio-client.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [MinioClientModule],
  exports: [MinioClientModule],
})
export class MediaStorageServiceModule {}
