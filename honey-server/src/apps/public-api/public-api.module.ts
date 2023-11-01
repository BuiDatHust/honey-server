import { ConfigurationModule } from '@configuration/configuration.module'
import { ConfigurationService } from '@configuration/configuration.service'
import { AuthController } from '@controllers/authentication.controller'
import { FileUploadController } from '@controllers/file-upload.controller'
import { OtpController } from '@controllers/otp.controller'
import { ProfileController } from '@controllers/profile.controller'
import { UserController } from '@controllers/user.controller'
import { MinioClientModule } from '@frameworks/media-storage-services/minio/minio-client.module'
import { AuthGuard } from '@guards/authentication.guard'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { InMemoryServiceModule } from '@services/in-memory-services/in-memory-services.module'
import { LoggerServiceModule } from '@services/logger-services/logger-services.module'
import { MailServiceModule } from '@services/mail-services/mail-services.module'
import { SmsServiceModule } from '@services/sms-services/sms-services.module'
import { AccountSettingUserUsecaseModule } from '@use-cases/account-setting-user/account-setting-user.module'
import { AuthUsecaseModule } from '@use-cases/auth/auth.module'
import { FileUseCasesModule } from '@use-cases/file/file.module'
import { FriendUsecaseModule } from '@use-cases/friend/friend.module'
import { NotificationSettingUserUsecaseModule } from '@use-cases/notification-setting-user/notification-setting-user.module'
import { OtpUseCaseModule } from '@use-cases/otp/otp.module'
import { SearchSettingUserUsecasewModule } from '@use-cases/search-setting-user/search-setting-user.module'
import { TokenUsecaseModule } from '@use-cases/token/token.module'
import { UserDeviceUsecaseModule } from '@use-cases/user-device/user-device.module'
import { UserSettingUsecaseModule } from '@use-cases/user-setting/user-setting.module'
import { UserUsecaseModule } from '@use-cases/user/user.module'

@Module({
  imports: [
    LoggerServiceModule,
    ConfigurationModule.forRoot(),
    InMemoryServiceModule,
    MailServiceModule,
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
          publicKey: configService.get<string>('jwt.public_key'),
          privateKey: configService.get<string>('jwt.private_key'),
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
  ],
  controllers: [
    FileUploadController,
    AuthController,
    OtpController,
    UserController,
    ProfileController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class PublicApiModule {}
