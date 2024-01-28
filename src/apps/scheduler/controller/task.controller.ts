import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { SchedulerUsecase } from '@use-cases/scheduler/scheduler.use-case'

@Injectable()
export class TaskController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly schedulerUsecase: SchedulerUsecase,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async getTotalCurrentActiveUserInRoom() {
    this.logger.info('getTotalCurrentActiveUserInRoom')
    await this.schedulerUsecase.handleGetTotalUserInRoom()
  }
}
