import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { Logger } from 'nestjs-pino'
import { join } from 'path'
import { SchedulerModule } from './scheduler.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice(SchedulerModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50052',
      package: 'scheduler',
      protoPath: join(
        __dirname,
        '../../frameworks/rpc-client-services/grpc/protobufs/scheduler.proto',
      ),
      loader: {
        keepCase: true,
      },
    },
  })

  const logger = app.get(Logger)
  app.useLogger(logger)

  await app.listen()
  logger.log('Scheduler service is running!')
}
bootstrap()
