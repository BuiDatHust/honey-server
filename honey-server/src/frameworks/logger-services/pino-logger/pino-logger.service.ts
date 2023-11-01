import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { Injectable } from '@nestjs/common'
import { PinoLogger } from 'nestjs-pino'

@Injectable()
export class PinoLoggerService extends PinoLogger implements ILoggerService {}
