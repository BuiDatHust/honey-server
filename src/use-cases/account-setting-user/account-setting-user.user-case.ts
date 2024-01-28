import { IDataServices } from '@core/abstracts'
import { AccountSetting } from '@frameworks/data-servies/mongodb/models/account-setting.model'
import { Injectable } from '@nestjs/common'
import { CreateAccountSettingDto } from '@use-cases/account-setting-user/dto/create-account-setting.dto'
import { UpdateAccountSettingDto } from '@use-cases/account-setting-user/dto/update-account-setting.dto'
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
    const existedAccountSetting = await this.dataService.accountSettings.getOne({
      user_id: new Types.ObjectId(dto.user_id),
    })
    if(existedAccountSetting){
      const result = await this.dataService.accountSettings.update(existedAccountSetting._id, attribute)
      return result
    }
    
    const accountSetting = await this.dataService.accountSettings.create(attribute)
    return accountSetting
  }

  async updateAccountSetting(user_id: string, dto: UpdateAccountSettingDto) {
    this.logger.debug({ user_id, dto }, 'updateAccountSetting')
    const accountSetting = await this.dataService.accountSettings.updateByFilter(
      { user_id: new Types.ObjectId(user_id) },
      dto,
    )

    return accountSetting
  }
}
