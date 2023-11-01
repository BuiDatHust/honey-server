import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { RefreshTokenFactory } from './refresh-token.factory'
import { RefreshTokenUsecase } from './refresh-token.use-case'

@Module({
  imports: [DataServicesModule],
  providers: [RefreshTokenUsecase, RefreshTokenFactory],
  exports: [RefreshTokenUsecase],
})
export class RefreshTokenUsecaseModule {}
