import { AccessToken } from '@frameworks/data-servies/mongodb/models/access-token.model'
import { AccountSetting } from '@frameworks/data-servies/mongodb/models/account-setting.model'
import { ChatSetting } from '@frameworks/data-servies/mongodb/models/chat-setting.model'
import { Complaint } from '@frameworks/data-servies/mongodb/models/complaint.model'
import { FeatureUsageCount } from '@frameworks/data-servies/mongodb/models/feature-usage-count.model'
import { Friend } from '@frameworks/data-servies/mongodb/models/friend.model'
import { MatchMakingRequest } from '@frameworks/data-servies/mongodb/models/match-making-request.model'
import { MeetingRecord } from '@frameworks/data-servies/mongodb/models/meeting-record.model'
import { Message } from '@frameworks/data-servies/mongodb/models/message.model'
import { NotificationLog } from '@frameworks/data-servies/mongodb/models/notification-log.model'
import { NotificationSetting } from '@frameworks/data-servies/mongodb/models/notification-setting.model'
import { NotificationToken } from '@frameworks/data-servies/mongodb/models/notification-token.model'
import { Otp } from '@frameworks/data-servies/mongodb/models/otp.model'
import { RefreshToken } from '@frameworks/data-servies/mongodb/models/refresh-token.model'
import { SearchSetting } from '@frameworks/data-servies/mongodb/models/search-setting.model'
import { SessionHistory } from '@frameworks/data-servies/mongodb/models/session-history.model'
import { Subscription } from '@frameworks/data-servies/mongodb/models/subscription.model'
import { Transaction } from '@frameworks/data-servies/mongodb/models/transaction.model'
import { UserDevice } from '@frameworks/data-servies/mongodb/models/user-device.model'
import { UserReation } from '@frameworks/data-servies/mongodb/models/user-reaction.model'
import { User } from '@frameworks/data-servies/mongodb/models/user.model'
import { Wallet } from '@frameworks/data-servies/mongodb/models/wallet.model'
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
  abstract messages: IGenericRepository<Message>
  abstract meetingRecords: IGenericRepository<MeetingRecord>
  abstract featureUsageCount: IGenericRepository<FeatureUsageCount>
  abstract matchMakingRequest: IGenericRepository<MatchMakingRequest>
  abstract chatSetting: IGenericRepository<ChatSetting>
  abstract wallet: IGenericRepository<Wallet>
  abstract transaction: IGenericRepository<Transaction>
  abstract subscription: IGenericRepository<Subscription>
  abstract sessionHistory: IGenericRepository<SessionHistory>
  abstract accessToken: IGenericRepository<AccessToken>
  abstract complaint: IGenericRepository<Complaint>
  abstract notificationLog: IGenericRepository<NotificationLog>
  abstract notificationToken: IGenericRepository<NotificationToken>
}
