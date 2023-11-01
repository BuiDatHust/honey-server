import { AccountSetting } from '@frameworks/data-servies/mongodb/models/account-setting.model'
import { Friend } from '@frameworks/data-servies/mongodb/models/friend.model'
import { NotificationSetting } from '@frameworks/data-servies/mongodb/models/notification-setting.model'
import { Otp } from '@frameworks/data-servies/mongodb/models/otp.model'
import { RefreshToken } from '@frameworks/data-servies/mongodb/models/refresh-token.model'
import { SearchSetting } from '@frameworks/data-servies/mongodb/models/search-setting.model'
import { UserDevice } from '@frameworks/data-servies/mongodb/models/user-device.model'
import { UserReation } from '@frameworks/data-servies/mongodb/models/user-reaction.model'
import { User } from '@frameworks/data-servies/mongodb/models/user.model'
import { IGenericRepository } from './generic-repository.abstract'

export abstract class IDataServices {
  abstract users: IGenericRepository<User>
  abstract otps: IGenericRepository<Otp>
  abstract accountSettings: IGenericRepository<AccountSetting>
  abstract searchSettings: IGenericRepository<SearchSetting>
  abstract notificationSettings: IGenericRepository<NotificationSetting>
  abstract refreshTokens: IGenericRepository<RefreshToken>
  abstract userDevices: IGenericRepository<UserDevice>
  abstract userReations: IGenericRepository<UserReation>
  abstract friends: IGenericRepository<Friend>
}
