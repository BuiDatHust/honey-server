import { NestFactory } from '@nestjs/core'
import { Logger } from 'nestjs-pino'
import { NotificationWorkerModule } from './notification-worker.module'

async function bootstrap() {
  const app = await NestFactory.create(NotificationWorkerModule)
  const logger = app.get(Logger)
  await app.listen(3001, () => {
    logger.log('🚀 Notification Worker service started!')
  })
}
bootstrap()
