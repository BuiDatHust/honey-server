import { UNIT_DISTANCE } from '@frameworks/data-servies/mongodb/constant/account-setting.constant'
import {
  DEFAULT_DISTANCE_PREFERNCE,
  DEFAULT_MAX_AGE,
  DEFAULT_MIN_AGE,
} from '@frameworks/data-servies/mongodb/constant/search-setting.constant'
import { SearchSetting } from '@frameworks/data-servies/mongodb/models/search-setting.model'
import { Injectable } from '@nestjs/common'
import { CreateSearchSettingDto } from '@use-cases/search-setting-user/dto/create-search-setting.dto'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'

@Injectable()
export class SearchSettingUserFactory {
  constructor() {}

  public createSearchSetting(data: CreateSearchSettingDto): SearchSetting {
    const searchSetting = new SearchSetting()

    searchSetting.user_id = data.user_id
    searchSetting.distance_preference = data.distance_preference ?? DEFAULT_DISTANCE_PREFERNCE
    searchSetting.max_age_preference = data.max_age_preference ?? DEFAULT_MAX_AGE
    searchSetting.min_age_preference = data.min_age_preference ?? DEFAULT_MIN_AGE
    searchSetting.unit_distance = data.unit_distance ?? UNIT_DISTANCE.KILOMETERS
    searchSetting.is_only_show_in_age = data.is_only_show_in_age ?? false
    searchSetting.is_only_show_in_distance = data.is_only_show_in_distance ?? false
    searchSetting.created_at = getCurrentMilisecondTime()

    return searchSetting
  }
}
