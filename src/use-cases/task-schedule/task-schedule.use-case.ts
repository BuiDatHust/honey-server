import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { TYPE_MATCH_MAKING } from '@frameworks/data-servies/mongodb/constant/match-making.constant'
import { Injectable } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { RandomMatchingUsecase } from '@use-cases/random-matching/random-matching.use-case'
import {
  SPEED_UP_DELAY_TIME,
  SPEED_UP_RANDOM_CHAT_JOB_NAME_PREFIX,
  SPEED_UP_RANDOM_VOICE_JOB_NAME_PREFIX,
} from './constant/job.constant'

@Injectable()
export class TaskScheduleUsecase {
  constructor(
    private readonly logger: ILoggerService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly randomMatchingUsecase: RandomMatchingUsecase,
  ) {}

  public async addJobSpeedUpMatchMaking(
    speedUpLevel: number,
    typeMatchMaking: string,
    userId: string,
    matchMakingRequestId: string,
  ) {
    const prefixName =
      typeMatchMaking == TYPE_MATCH_MAKING.RANDOM_CHAT
        ? SPEED_UP_RANDOM_CHAT_JOB_NAME_PREFIX
        : SPEED_UP_RANDOM_VOICE_JOB_NAME_PREFIX
    const name = `${prefixName}${userId}_${matchMakingRequestId}`
    const milliseconds = SPEED_UP_DELAY_TIME[speedUpLevel - 1]

    this.deleteTimeout(name)

    const callback = async () => {
      this.logger.info(`Timeout ${name} executing after (${milliseconds})!`)

      try {
        await this.randomMatchingUsecase.handleMatchMaking(
          userId,
          matchMakingRequestId,
          typeMatchMaking,
        )
      } catch (error) {
        this.logger.error(error)
      }

      this.logger.info(`Timeout ${name} done!`)
    }
    const timeout = setTimeout(callback.bind(this), milliseconds)
    this.schedulerRegistry.addTimeout(name, timeout)

    this.logger.info(`timout job ${name} added for after ${milliseconds} miliseconds!`)
  }

  deleteCron(name: string) {
    const isExist = this.schedulerRegistry.doesExist('cron', name)
    if (!isExist) {
      return
    }

    this.schedulerRegistry.deleteCronJob(name)
    this.logger.warn(`job ${name} deleted!`)
  }

  deleteTimeout(name: string) {
    const isExist = this.schedulerRegistry.doesExist('timeout', name)
    if (!isExist) {
      return
    }

    this.schedulerRegistry.deleteTimeout(name)
    this.logger.warn(`timeout ${name} deleted!`)
  }
}
