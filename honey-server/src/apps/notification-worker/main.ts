import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { Logger } from 'nestjs-pino'
import { NotificationWorkerModule } from './notification-worker.module'

async function bootstrap() {
  // const configService = new ConfigurationService(new ConfigService())

  const app = await NestFactory.create(NotificationWorkerModule)
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'cats_queue',
      queueOptions: {
        durable: false,
      },
      noAck: false,
      persistent: true,
    },
  })
  await app.startAllMicroservices()

  const logger = app.get(Logger)
  app.useLogger(logger)

  await app.listen(4000)
  logger.log('🚀 Notification Worker service started')
}

bootstrap()
