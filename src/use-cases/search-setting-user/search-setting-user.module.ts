import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { SearchSettingUserFactory } from './search-setting-user.factory'
import { SearchSettingUserUsecase } from './search-setting-user.use-case'

@Module({
  imports: [DataServicesModule],
  providers: [SearchSettingUserFactory, SearchSettingUserUsecase],
  exports: [SearchSettingUserUsecase],
})
export class SearchSettingUserUsecasewModule {}
