import { ConfigurationModule } from '@configuration/configuration.module'
import { ConfigurationService } from '@configuration/configuration.service'
import { ChatController } from '@controllers/chat.controller'
import { ComplaintController } from '@controllers/complaint.controller'
import { FeatureController } from '@controllers/feature.controller'
import { FriendController } from '@controllers/friend.controller'
import { MatchMakingRoomController } from '@controllers/match-making-room.controller'
import { MessageController } from '@controllers/message.controller'
import { NotificationTokenController } from '@controllers/notification-token.controller'
import { SubscriptionController } from '@controllers/subscription.controller'
import { MinioClientModule } from '@frameworks/media-storage-services/minio/minio-client.module'
import {
  grpcClientOptions,
  grpcClientSchedulerOptions,
} from '@frameworks/rpc-client-services/grpc/grpc-client.option'
import { AuthGuard } from '@guards/authentication.guard'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule } from '@nestjs/microservices'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { InAppNotificationServiceModule } from '@services/in-app-notification-services/in-app-notification-services.module'
import { InMemoryServiceModule } from '@services/in-memory-services/in-memory-services.module'
import { LoggerServiceModule } from '@services/logger-services/logger-services.module'
import { MailServiceModule } from '@services/mail-services/mail-services.module'
import { MessgaeBrokerServiceModule } from '@services/message-broker-services/message-broker-service.module'
import { MqttClientServiceModule } from '@services/mqtt-client-services/mqtt-client-service.module'
import { RpcClientServiceModule } from '@services/rpc-client-services/rpc-client-services.module'
import { SmsServiceModule } from '@services/sms-services/sms-services.module'
import { AccountSettingUserUsecaseModule } from '@use-cases/account-setting-user/account-setting-user.module'
import { AuthUsecaseModule } from '@use-cases/auth/auth.module'
import { ChatUsecaseModule } from '@use-cases/chat/chat-use-case.module'
import { ComplaintUsecaseModule } from '@use-cases/complaint/comlaint-use-case.module'
import { FeatureUsageUsecaseModule } from '@use-cases/feature-usage/feature-usage-use-case.module'
import { FeatureUsecaseModule } from '@use-cases/feature/feature-use-case.module'
import { FileUseCasesModule } from '@use-cases/file/file.module'
import { FriendUsecaseModule } from '@use-cases/friend/friend.module'
import { NotificationSettingUserUsecaseModule } from '@use-cases/notification-setting-user/notification-setting-user.module'
import { NotificationUsecaseTokenModule } from '@use-cases/notification-token/notification-token-use-case.module'
import { NotificationUsecaseModule } from '@use-cases/notification/notification-use-case.module'
import { OtpUseCaseModule } from '@use-cases/otp/otp.module'
import { RandomMatchingUsecaseModule } from '@use-cases/random-matching/random-matching-use-case.module'
import { SearchSettingUserUsecasewModule } from '@use-cases/search-setting-user/search-setting-user.module'
import { SubscriptionUsecaseModule } from '@use-cases/subscription/subscription-use-case.module'
import { TokenUsecaseModule } from '@use-cases/token/token.module'
import { UserDeviceUsecaseModule } from '@use-cases/user-device/user-device.module'
import { UserSettingUsecaseModule } from '@use-cases/user-setting/user-setting.module'
import { UserUsecaseModule } from '@use-cases/user/user.module'
import { WalletUsecaseModule } from '@use-cases/wallet/wallet-use-case.module'
import { AuthController } from 'src/apps/public-api/controllers/authentication.controller'
import { OtpController } from 'src/apps/public-api/controllers/otp.controller'
import { ProfileController } from 'src/apps/public-api/controllers/profile.controller'
import { UserController } from 'src/apps/public-api/controllers/user.controller'

@Module({
  imports: [
    LoggerServiceModule,
    ConfigurationModule.forRoot(),
    InMemoryServiceModule,
    MailServiceModule,
    InAppNotificationServiceModule,
    DataServicesModule,
    SmsServiceModule,
    MinioClientModule,
    FileUseCasesModule,
    OtpUseCaseModule,
    AccountSettingUserUsecaseModule,
    NotificationSettingUserUsecaseModule,
    SearchSettingUserUsecasewModule,
    AuthUsecaseModule,
    UserUsecaseModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigurationModule],
      useFactory: async (configService: ConfigurationService) => {
        return {
          secret: configService.get<string>('jwt.secret_key'),
          signOptions: {
            algorithm: configService.get('jwt.algorithm'),
          },
          verifyOptions: {
            algorithms: [configService.get('jwt.algorithm')],
          },
        }
      },
      inject: [ConfigurationService],
    }),
    TokenUsecaseModule,
    UserDeviceUsecaseModule,
    UserSettingUsecaseModule,
    FriendUsecaseModule,
    RpcClientServiceModule,
    MqttClientServiceModule,
    MessgaeBrokerServiceModule,
    ClientsModule.register([
      {
        name: 'API_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
    ClientsModule.register([
      {
        name: 'SCHEDULER_PACKAGE',
        ...grpcClientSchedulerOptions,
      },
    ]),
    RandomMatchingUsecaseModule,
    ChatUsecaseModule,
    WalletUsecaseModule,
    FeatureUsageUsecaseModule,
    FeatureUsecaseModule,
    SubscriptionUsecaseModule,
    ComplaintUsecaseModule,
    NotificationUsecaseModule,
    NotificationUsecaseTokenModule,
  ],
  controllers: [
    AuthController,
    OtpController,
    UserController,
    ProfileController,
    MatchMakingRoomController,
    FriendController,
    ChatController,
    MessageController,
    SubscriptionController,
    FeatureController,
    ComplaintController,
    NotificationTokenController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class PublicApiModule {}
