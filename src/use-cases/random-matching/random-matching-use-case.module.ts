import {
  grpcClientOptions,
  grpcClientSchedulerOptions,
} from '@frameworks/rpc-client-services/grpc/grpc-client.option'
import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { DataServicesModule } from '@services/data-services/data-services.module'
import { InMemoryServiceModule } from '@services/in-memory-services/in-memory-services.module'
import { MessgaeBrokerServiceModule } from '@services/message-broker-services/message-broker-service.module'
import { MqttClientServiceModule } from '@services/mqtt-client-services/mqtt-client-service.module'
import { RpcClientServiceModule } from '@services/rpc-client-services/rpc-client-services.module'
import { UserUsecaseModule } from '@use-cases/user/user.module'
import { RandomMatchingUsecase } from './random-matching.use-case'

@Module({
  imports: [
    RpcClientServiceModule,
    MqttClientServiceModule,
    MessgaeBrokerServiceModule,
    InMemoryServiceModule,
    UserUsecaseModule,
    DataServicesModule,
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
  ],
  providers: [RandomMatchingUsecase],
  exports: [RandomMatchingUsecase],
})
export class RandomMatchingUsecaseModule {}
