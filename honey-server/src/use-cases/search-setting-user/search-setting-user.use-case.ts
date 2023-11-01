import { IDataServices } from '@core/abstracts'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { CreateSearchSettingDto } from '@core/dtos/search-setting/create-search-setting.dto'
import { UpdateSearchSettingDto } from '@core/dtos/search-setting/update-search-setting.dto'
import { SearchSetting } from '@frameworks/data-servies/mongodb/models/search-setting.model'
import { Injectable } from '@nestjs/common'
import { Types } from 'mongoose'
import { SearchSettingUserFactory } from './search-setting-user.factory'

@Injectable()
export class SearchSettingUserUsecase {
  constructor(
    private readonly logger: ILoggerService,
    private dataService: IDataServices,
    private searchSettingFactory: SearchSettingUserFactory,
  ) {
    this.logger.setContext(SearchSettingUserUsecase.name)
  }

  public async createSearchSetting(dto: CreateSearchSettingDto): Promise<SearchSetting> {
    const data = this.searchSettingFactory.createSearchSetting(dto)
    const searchSetting = await this.dataService.searchSettings.create(data)

    return searchSetting
  }

  public async updateSearchSetting(user_id: Types.ObjectId, dto: UpdateSearchSettingDto) {
    this.logger.debug({ user_id, dto }, 'updateSearchSetting')
    const data = this.searchSettingFactory.updateSearchSetting(dto)
    await this.dataService.searchSettings.updateByFilter(
      { user_id: new Types.ObjectId(user_id) },
      data,
    )
  }

  public async getOneByFilter(filter): Promise<SearchSetting> {
    const data = await this.dataService.searchSettings.getOne(filter)

    return data
  }
}
