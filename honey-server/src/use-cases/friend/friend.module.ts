import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { InMemoryServiceModule } from '@services/in-memory-services/in-memory-services.module'
import { FriendFactory } from './friend.factory'
import { FriendUsecase } from './friend.use-case'

@Module({
  imports: [DataServicesModule, InMemoryServiceModule],
  providers: [FriendFactory, FriendUsecase],
  exports: [FriendUsecase],
})
export class FriendUsecaseModule {}
