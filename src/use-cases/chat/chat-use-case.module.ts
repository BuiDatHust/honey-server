import { Module } from '@nestjs/common'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { MessgaeBrokerServiceModule } from '@services/message-broker-services/message-broker-service.module'
import { ChatUsecase } from './chat.use-case'

@Module({
  imports: [DataServicesModule, MessgaeBrokerServiceModule],
  providers: [ChatUsecase],
  exports: [ChatUsecase],
})
export class ChatUsecaseModule {}
