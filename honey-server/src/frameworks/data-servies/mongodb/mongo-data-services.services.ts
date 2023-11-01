import { IDataServices } from '@core/abstracts/data-services.abstract'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AccountSetting, AccountSettingDocument } from './models/account-setting.model'
import { Friend, FriendDocument } from './models/friend.model'
import {
  NotificationSetting,
  NotificationSettingDocument,
} from './models/notification-setting.model'
import { Otp, OtpDocument } from './models/otp.model'
import { RefreshToken, RefreshTokenDocument } from './models/refresh-token.model'
import { SearchSetting, SearchSettingDocument } from './models/search-setting.model'
import { UserDevice, UserDeviceDocument } from './models/user-device.model'
import { UserReation, UserReationDocument } from './models/user-reaction.model'
import { User, UserDocument } from './models/user.model'
import { MongoGenericRepository } from './mongo-generic-repository'

@Injectable()
export class MongoDataServices implements IDataServices, OnApplicationBootstrap {
  users: MongoGenericRepository<User>
  otps: MongoGenericRepository<Otp>
  accountSettings: MongoGenericRepository<AccountSetting>
  searchSettings: MongoGenericRepository<SearchSetting>
  notificationSettings: MongoGenericRepository<NotificationSetting>
  refreshTokens: MongoGenericRepository<RefreshToken>
  userDevices: MongoGenericRepository<UserDevice>
  userReations: MongoGenericRepository<UserReation>
  friends: MongoGenericRepository<Friend>

  constructor(
    @InjectModel(User.name)
    private readonly userRepository: Model<UserDocument>,
    @InjectModel(Otp.name)
    private readonly otpRepository: Model<OtpDocument>,
    @InjectModel(AccountSetting.name)
    private readonly accountSettingRepository: Model<AccountSettingDocument>,
    @InjectModel(SearchSetting.name)
    private readonly searchSettingRepository: Model<SearchSettingDocument>,
    @InjectModel(NotificationSetting.name)
    private readonly notificationSettingRepository: Model<NotificationSettingDocument>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenRepository: Model<RefreshTokenDocument>,
    @InjectModel(UserDevice.name)
    private readonly userDeviceRepository: Model<UserDeviceDocument>,
    @InjectModel(UserReation.name)
    private readonly userReactionRepository: Model<UserReationDocument>,
    @InjectModel(Friend.name)
    private readonly friendRepository: Model<FriendDocument>,
  ) {}

  onApplicationBootstrap() {
    this.users = new MongoGenericRepository<User>(this.userRepository)
    this.otps = new MongoGenericRepository<Otp>(this.otpRepository)
    this.accountSettings = new MongoGenericRepository<AccountSetting>(this.accountSettingRepository)
    this.searchSettings = new MongoGenericRepository<SearchSetting>(this.searchSettingRepository)
    this.notificationSettings = new MongoGenericRepository<NotificationSetting>(
      this.notificationSettingRepository,
    )
    this.refreshTokens = new MongoGenericRepository<RefreshToken>(this.refreshTokenRepository)
    this.userDevices = new MongoGenericRepository<UserDevice>(this.userDeviceRepository)
    this.userReations = new MongoGenericRepository<UserReation>(this.userReactionRepository)
    this.friends = new MongoGenericRepository<Friend>(this.friendRepository)
  }
}
