import { NestFactory } from '@nestjs/core'
import { Logger } from 'nestjs-pino'
import { MatchMakingWorkerModule } from './match-making-worker.module'

async function bootstrap() {
  const app = await NestFactory.create(MatchMakingWorkerModule)
  const logger = app.get(Logger)
  await app.listen(3000, () => {
    logger.log('🚀 Match Making Worker service started!')
  })
}
bootstrap()
