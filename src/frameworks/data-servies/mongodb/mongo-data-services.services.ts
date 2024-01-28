import { IGenericRepository } from '@core/abstracts'
import { IDataServices } from '@core/abstracts/data-services.abstract'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AccessToken, AccessTokenDocument } from './models/access-token.model'
import { AccountSetting, AccountSettingDocument } from './models/account-setting.model'
import { ChatSetting, ChatSettingDocument } from './models/chat-setting.model'
import { Complaint, ComplaintDocument } from './models/complaint.model'
import { FeatureUsageCount, FeatureUsageCountDocument } from './models/feature-usage-count.model'
import { Friend, FriendDocument } from './models/friend.model'
import { MatchMakingRequest, MatchMakingRequestDocument } from './models/match-making-request.model'
import { MeetingRecord, MeetingRecordDocument } from './models/meeting-record.model'
import { Message, MessageDocument } from './models/message.model'
import { NotificationLog, NotificationLogDocument } from './models/notification-log.model'
import {
  NotificationSetting,
  NotificationSettingDocument,
} from './models/notification-setting.model'
import { NotificationToken } from './models/notification-token.model'
import { Otp, OtpDocument } from './models/otp.model'
import { RefreshToken, RefreshTokenDocument } from './models/refresh-token.model'
import { SearchSetting, SearchSettingDocument } from './models/search-setting.model'
import { SessionHistory, SessionHistoryDocument } from './models/session-history.model'
import { Subscription, SubscriptionDocument } from './models/subscription.model'
import { Transaction, TransactionDocument } from './models/transaction.model'
import { UserDevice, UserDeviceDocument } from './models/user-device.model'
import { UserReation, UserReationDocument } from './models/user-reaction.model'
import { User, UserDocument } from './models/user.model'
import { Wallet, WalletDocument } from './models/wallet.model'
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
  messages: MongoGenericRepository<Message>
  meetingRecords: MongoGenericRepository<MeetingRecord>
  featureUsageCount: MongoGenericRepository<FeatureUsageCount>
  matchMakingRequest: MongoGenericRepository<MatchMakingRequest>
  chatSetting: MongoGenericRepository<ChatSetting>
  wallet: MongoGenericRepository<Wallet>
  transaction: MongoGenericRepository<Transaction>
  subscription: MongoGenericRepository<Subscription>
  sessionHistory: MongoGenericRepository<SessionHistory>
  accessToken: MongoGenericRepository<AccessToken>
  complaint: MongoGenericRepository<Complaint>
  notificationLog: IGenericRepository<NotificationLog>
  notificationToken: IGenericRepository<NotificationToken>

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
    @InjectModel(Message.name)
    private readonly messageRepository: Model<MessageDocument>,
    @InjectModel(MeetingRecord.name)
    private readonly meetingRecordRepository: Model<MeetingRecordDocument>,
    @InjectModel(FeatureUsageCount.name)
    private readonly featureUsageCountRepository: Model<FeatureUsageCountDocument>,
    @InjectModel(MatchMakingRequest.name)
    private readonly matchMakingRepository: Model<MatchMakingRequestDocument>,
    @InjectModel(ChatSetting.name)
    private readonly chatSettingRepository: Model<ChatSettingDocument>,
    @InjectModel(Wallet.name)
    private readonly walletRepository: Model<WalletDocument>,
    @InjectModel(Transaction.name)
    private readonly transactionRepository: Model<TransactionDocument>,
    @InjectModel(Subscription.name)
    private readonly subsciptionRepository: Model<SubscriptionDocument>,
    @InjectModel(SessionHistory.name)
    private readonly sessionHistoryRepository: Model<SessionHistoryDocument>,
    @InjectModel(AccessToken.name)
    private readonly accessTokenRepository: Model<AccessTokenDocument>,
    @InjectModel(Complaint.name)
    private readonly complaintRepository: Model<ComplaintDocument>,
    @InjectModel(NotificationLog.name)
    private readonly notificationRepository: Model<NotificationLogDocument>,
    @InjectModel(NotificationToken.name)
    private readonly notificationTokenRepository: Model<NotificationToken>,
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
    this.messages = new MongoGenericRepository<Message>(this.messageRepository)
    this.meetingRecords = new MongoGenericRepository<MeetingRecord>(this.meetingRecordRepository)
    this.featureUsageCount = new MongoGenericRepository<FeatureUsageCount>(
      this.featureUsageCountRepository,
    )
    this.matchMakingRequest = new MongoGenericRepository<MatchMakingRequest>(
      this.matchMakingRepository,
    )
    this.chatSetting = new MongoGenericRepository<ChatSetting>(this.chatSettingRepository)
    this.wallet = new MongoGenericRepository<Wallet>(this.walletRepository)
    this.subscription = new MongoGenericRepository<Subscription>(this.subsciptionRepository)
    this.transaction = new MongoGenericRepository<Transaction>(this.transactionRepository)
    this.sessionHistory = new MongoGenericRepository<SessionHistory>(this.sessionHistoryRepository)
    this.accessToken = new MongoGenericRepository<AccessToken>(this.accessTokenRepository)
    this.complaint = new MongoGenericRepository<Complaint>(this.complaintRepository)
    this.notificationLog = new MongoGenericRepository<NotificationLog>(this.notificationRepository)
    this.notificationToken = new MongoGenericRepository<NotificationToken>(
      this.notificationTokenRepository,
    )
  }
}
