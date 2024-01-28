import { ConfigurationModule } from '@configuration/configuration.module'
import { ConfigurationService } from '@configuration/configuration.service'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { LoggerServiceModule } from '@services/logger-services/logger-services.module'
import { MessgaeBrokerServiceModule } from '@services/message-broker-services/message-broker-service.module'
import { MqttClientServiceModule } from '@services/mqtt-client-services/mqtt-client-service.module'
import { ChatUsecaseModule } from '@use-cases/chat/chat-use-case.module'
import { TokenUsecaseModule } from '@use-cases/token/token.module'
import { ChatController } from './controller/chat.controller'
import { RandomRoomController } from './controller/random-room.controller'
import { SignallingWebRTCController } from './controller/signalling-webrtc.controller'

@Module({
  imports: [
    MqttClientServiceModule,
    LoggerServiceModule,
    ConfigurationModule.forRoot(),
    TokenUsecaseModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigurationModule],
      useFactory: async (configService: ConfigurationService) => {
        return {
          secret: configService.get<string>('jwt.secret_key'),
          // publicKey: configService.get<string>('jwt.public_key'),
          // privateKey: configService.get<string>('jwt.private_key'),
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
    ChatUsecaseModule,
    DataServicesModule,
    MessgaeBrokerServiceModule,
  ],
  controllers: [ChatController, SignallingWebRTCController, RandomRoomController],
})
export class WebsocketSubscriberModule {}
