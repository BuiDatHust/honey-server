import { Module } from '@nestjs/common'
import { InMemoryServiceModule } from '@services/in-memory-services/in-memory-services.module'
import { RefreshTokenUsecaseModule } from '@use-cases/refresh-token/refresh-token.module'
import { UserDeviceUsecaseModule } from '@use-cases/user-device/user-device.module'
import { AuthGuard } from '../../guards/authentication.guard'
import { TokenUsecase } from './token.use-case'

@Module({
  imports: [RefreshTokenUsecaseModule, InMemoryServiceModule, UserDeviceUsecaseModule],
  providers: [TokenUsecase, AuthGuard],
  exports: [TokenUsecase, AuthGuard],
})
export class TokenUsecaseModule {}
