import { IRpcClientService } from '@core/abstracts/rpc-client-services.abstract'
import { Module } from '@nestjs/common'
import { GrpcClientService } from './grpc-client-service.service'
import { ClientsModule } from '@nestjs/microservices'
import {
  grpcClientOptions,
  grpcClientSchedulerOptions,
} from '@frameworks/rpc-client-services/grpc/grpc-client.option'

@Module({
  imports: [
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
  providers: [
    {
      provide: IRpcClientService,
      useClass: GrpcClientService,
    },
  ],
  exports: [IRpcClientService],
})
export class GrpcClientServiceModule {}
