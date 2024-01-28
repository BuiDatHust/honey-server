import { Module } from '@nestjs/common'
import { MediaStorageServiceModule } from '@services/media-storage-services/media-storage-services.module'
import { FileUseCases } from './file.use-case'

@Module({
  imports: [MediaStorageServiceModule],
  providers: [FileUseCases],
  exports: [FileUseCases],
})
export class FileUseCasesModule {}
