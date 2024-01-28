import { PinoLoggerModule } from '@frameworks/logger-services/pino-logger/pino-logger.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [PinoLoggerModule],
  exports: [PinoLoggerModule],
})
export class LoggerServiceModule {}
