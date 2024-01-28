import { IDataServices } from '@core/abstracts'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AccessToken, AccessTokenSchema } from './models/access-token.model'
import { AccountSetting, AccountSettingSchema } from './models/account-setting.model'
import { ChatSetting, ChatSettingSchema } from './models/chat-setting.model'
import { Complaint, ComplaintSchema } from './models/complaint.model'
import { FeatureUsageCount, FeatureUsageCountSchema } from './models/feature-usage-count.model'
import { Friend, FriendSchema } from './models/friend.model'
import { MatchMakingRequest, MatchMakingRequestSchema } from './models/match-making-request.model'
import { MeetingRecord, MeetingRecordSchema } from './models/meeting-record.model'
import { Message, MessageSchema } from './models/message.model'
import { NotificationLog, NotificationLogSchema } from './models/notification-log.model'
import { NotificationSetting, NotificationSettingSchema } from './models/notification-setting.model'
import { NotificationToken, NotificationTokenSchema } from './models/notification-token.model'
import { Otp, OtpSchema } from './models/otp.model'
import { RefreshToken, RefreshTokenSchema } from './models/refresh-token.model'
import { SearchSetting, SearchSettingSchema } from './models/search-setting.model'
import { SessionHistory, SessionHistorySchema } from './models/session-history.model'
import { Subscription, SubscriptionSchema } from './models/subscription.model'
import { Transaction, TransactionSchema } from './models/transaction.model'
import { UserDevice, UserDeviceSchema } from './models/user-device.model'
import { UserReation, UserReationSchema } from './models/user-reaction.model'
import { User, UserSchema } from './models/user.model'
import { Wallet, WalletSchema } from './models/wallet.model'
import { MongoDataServices } from './mongo-data-services.services'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: AccountSetting.name, schema: AccountSettingSchema },
      { name: SearchSetting.name, schema: SearchSettingSchema },
      { name: NotificationSetting.name, schema: NotificationSettingSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: UserDevice.name, schema: UserDeviceSchema },
      { name: UserReation.name, schema: UserReationSchema },
      { name: Friend.name, schema: FriendSchema },
      { name: Message.name, schema: MessageSchema },
      { name: MeetingRecord.name, schema: MeetingRecordSchema },
      { name: FeatureUsageCount.name, schema: FeatureUsageCountSchema },
      { name: MatchMakingRequest.name, schema: MatchMakingRequestSchema },
      { name: ChatSetting.name, schema: ChatSettingSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: SessionHistory.name, schema: SessionHistorySchema },
      { name: AccessToken.name, schema: AccessTokenSchema },
      { name: Complaint.name, schema: ComplaintSchema },
      { name: NotificationLog.name, schema: NotificationLogSchema },
      { name: NotificationToken.name, schema: NotificationTokenSchema },
    ]),
    MongooseModule.forRoot('mongodb://admin:admin@localhost:27017'),
  ],
  providers: [
    {
      provide: IDataServices,
      useClass: MongoDataServices,
    },
  ],
  exports: [IDataServices],
})
export class MongoDataServicesModule {}
