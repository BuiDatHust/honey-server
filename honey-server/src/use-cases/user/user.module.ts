import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { InMemoryServiceModule } from '@services/in-memory-services/in-memory-services.module'
import { SearchSettingUserUsecasewModule } from '@use-cases/search-setting-user/search-setting-user.module'
import { UserFactoryService } from './user-factory.service'
import { UserUsecase } from './user.use-case'

@Module({
  imports: [DataServicesModule, SearchSettingUserUsecasewModule, InMemoryServiceModule],
  providers: [UserUsecase, UserFactoryService],
  exports: [UserUsecase],
})
export class UserUsecaseModule {}
