import { ClientOptions, Transport } from '@nestjs/microservices'
import { join } from 'path'

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: 'localhost:50051',
    gracefulShutdown: true,
    package: 'api',
    protoPath: join(
      __dirname,
      '../../../../src/frameworks/rpc-client-services/grpc/protobufs/user.proto',
    ),
    loader: {
      keepCase: true,
    },
  },
}

export const grpcClientSchedulerOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: 'localhost:50052',
    gracefulShutdown: true,
    package: 'scheduler',
    protoPath: join(
      __dirname,
      '../../../../src/frameworks/rpc-client-services/grpc/protobufs/scheduler.proto',
    ),
    loader: {
      keepCase: true,
    },
  },
}
