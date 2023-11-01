import { IDataServices } from '@core/abstracts'
import { CreateAccountSettingDto } from '@core/dtos/account-setting/create-account-setting.dto'
import { UpdateAccountSettingDto } from '@core/dtos/account-setting/update-account-setting.dto'
import { AccountSetting } from '@frameworks/data-servies/mongodb/models/account-setting.model'
import { Injectable } from '@nestjs/common'
import { Types } from 'mongoose'
import { PinoLogger } from 'nestjs-pino'
import { AccountSettingFactory } from './account-setting-user.factory'

@Injectable()
export class AccountSettingUserUseCase {
  constructor(
    private readonly logger: PinoLogger,
    private dataService: IDataServices,
    private accountSettingFactory: AccountSettingFactory,
  ) {
    this.logger.setContext(AccountSettingUserUseCase.name)
  }

  async createAccountSetting(dto: CreateAccountSettingDto): Promise<AccountSetting> {
    this.logger.debug({ dto }, 'createAccountSetting')
    const attribute = this.accountSettingFactory.createAccountSetting(dto)
    const accountSetting = await this.dataService.accountSettings.create(attribute)

    return accountSetting
  }

  async updateAccountSetting(user_id: Types.ObjectId, dto: UpdateAccountSettingDto) {
    this.logger.debug({ user_id, dto }, 'updateAccountSetting')
    const attribute = this.accountSettingFactory.updateAccountSetting(dto)
    const accountSetting = await this.dataService.accountSettings.updateByFilter(
      { user_id: new Types.ObjectId(user_id) },
      attribute,
    )

    return accountSetting
  }
}
