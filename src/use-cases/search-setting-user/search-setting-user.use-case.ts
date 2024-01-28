import { IDataServices } from '@core/abstracts'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { SearchSetting } from '@frameworks/data-servies/mongodb/models/search-setting.model'
import { Injectable } from '@nestjs/common'
import { CreateSearchSettingDto } from '@use-cases/search-setting-user/dto/create-search-setting.dto'
import { UpdateSearchSettingDto } from '@use-cases/search-setting-user/dto/update-search-setting.dto'
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

    const existedSearchSetting = await this.dataService.searchSettings.getOne({
      user_id: new Types.ObjectId(dto.user_id),
    })
    if (existedSearchSetting) {
      const result = await this.dataService.searchSettings.update(
        existedSearchSetting._id,
        data,
      )
      return result
    }

    const searchSetting = await this.dataService.searchSettings.create(data)
    return searchSetting
  }

  public async updateSearchSetting(user_id: string, dto: UpdateSearchSettingDto) {
    this.logger.debug({ user_id, dto }, 'updateSearchSetting')
    const searchSetting = await this.dataService.searchSettings.updateByFilter(
      { user_id: user_id },
      dto,
    )

    return searchSetting
  }

  public async getOneByFilter(filter): Promise<SearchSetting> {
    const data = await this.dataService.searchSettings.getOne(filter)

    return data
  }
}
