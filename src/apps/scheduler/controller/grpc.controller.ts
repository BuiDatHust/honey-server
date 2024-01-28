import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { SpeedUpMatchMakingGrpcRequestDto } from '@use-cases/random-matching/dto/speed-up-match-making-grpc-request.dto'
import { SchedulerUsecase } from '@use-cases/scheduler/scheduler.use-case'
import { validate } from 'class-validator'

@Controller()
export class GrpcController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly schedulerUsecase: SchedulerUsecase,
  ) {}

  @GrpcMethod('SchedulerService', 'speedUpMatchMaking')
  public async speedUpMatchMaking(data: SpeedUpMatchMakingGrpcRequestDto) {
    this.logger.info({ data })

    const errors = await validate(data)
    if (errors.length) {
    }

    try {
      await this.schedulerUsecase.speedUpMatchMaking({
        userId: data.user_id,
        speedUpLevel: data.speed_up_level,
        matchMakingRequestId: data.match_making_request_id,
        typeMatchMaking: data.type_match_making,
      })
      return { status: true }
    } catch (error) {
      this.logger.error(error)
      return { status: false }
    }
  }
}
