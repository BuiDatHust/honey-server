import { Global, Module } from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino'
import { Level } from 'pino'

import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { PinoLoggerService } from './pino-logger.service'
import { loggerOptions } from './utils'

@Global()
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: loggerOptions(process.env.APP_ENV || 'prod', process.env.LOG_LEVEL as Level),
    }),
  ],
  providers: [
    {
      provide: ILoggerService,
      useClass: PinoLoggerService,
    },
  ],
  exports: [ILoggerService],
})
export class PinoLoggerModule {}
