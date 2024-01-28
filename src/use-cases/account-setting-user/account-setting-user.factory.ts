import { UNIT_DISTANCE } from '@frameworks/data-servies/mongodb/constant/account-setting.constant'
import { AccountSetting } from '@frameworks/data-servies/mongodb/models/account-setting.model'
import { Injectable } from '@nestjs/common'
import { CreateAccountSettingDto } from '@use-cases/account-setting-user/dto/create-account-setting.dto'
import { UpdateAccountSettingDto } from '@use-cases/account-setting-user/dto/update-account-setting.dto'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'

@Injectable()
export class AccountSettingFactory {
  constructor() {}

  public createAccountSetting(data: CreateAccountSettingDto): AccountSetting {
    const accountSetting = new AccountSetting()
    accountSetting.user_id = data.user_id
    accountSetting.unit_distance = data.unit_distance ?? UNIT_DISTANCE.KILOMETERS
    accountSetting.language = data.language
    accountSetting.created_at = getCurrentMilisecondTime()

    return accountSetting
  }

  public updateAccountSetting(data: UpdateAccountSettingDto): AccountSetting {
    const accountSetting = new AccountSetting()
    accountSetting.unit_distance = data.unit_distance ?? UNIT_DISTANCE.KILOMETERS
    if (accountSetting.language) {
      accountSetting.language = data.language
    }
    accountSetting.updated_at = getCurrentMilisecondTime()

    return accountSetting
  }
}
