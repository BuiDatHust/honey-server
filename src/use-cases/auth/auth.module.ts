import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { AccountSettingUserUsecaseModule } from '@use-cases/account-setting-user/account-setting-user.module'
import { NotificationSettingUserUsecaseModule } from '@use-cases/notification-setting-user/notification-setting-user.module'
import { OtpUseCaseModule } from '@use-cases/otp/otp.module'
import { RefreshTokenUsecaseModule } from '@use-cases/refresh-token/refresh-token.module'
import { SearchSettingUserUsecasewModule } from '@use-cases/search-setting-user/search-setting-user.module'
import { TokenUsecaseModule } from '@use-cases/token/token.module'
import { UserDeviceUsecaseModule } from '@use-cases/user-device/user-device.module'
import { UserUsecaseModule } from '@use-cases/user/user.module'
import { AuthUseCase } from './auth.use-case'

@Module({
  imports: [
    OtpUseCaseModule,
    AccountSettingUserUsecaseModule,
    NotificationSettingUserUsecaseModule,
    SearchSettingUserUsecasewModule,
    DataServicesModule,
    UserUsecaseModule,
    TokenUsecaseModule,
    RefreshTokenUsecaseModule,
    UserDeviceUsecaseModule,
  ],
  providers: [AuthUseCase],
  exports: [AuthUseCase],
})
export class AuthUsecaseModule {}
