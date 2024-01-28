import { GrpcClientServiceModule } from '@frameworks/rpc-client-services/grpc/grpc-client-service.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [GrpcClientServiceModule],
  exports: [GrpcClientServiceModule],
})
export class RpcClientServiceModule {}
