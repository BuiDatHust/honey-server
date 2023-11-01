import { IDataServices } from '@core/abstracts'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AccountSetting, AccountSettingSchema } from './models/account-setting.model'
import { Friend, FriendSchema } from './models/friend.model'
import { NotificationSetting, NotificationSettingSchema } from './models/notification-setting.model'
import { Otp, OtpSchema } from './models/otp.model'
import { RefreshToken, RefreshTokenSchema } from './models/refresh-token.model'
import { SearchSetting, SearchSettingSchema } from './models/search-setting.model'
import { UserDevice, UserDeviceSchema } from './models/user-device.model'
import { UserReation, UserReationSchema } from './models/user-reaction.model'
import { User, UserSchema } from './models/user.model'
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
