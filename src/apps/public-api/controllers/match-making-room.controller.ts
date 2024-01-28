import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { CurrentUser } from '@decorators/current-user.decorator'
import { Body, Controller, Put } from '@nestjs/common'
import { CancelMatchMakingRequestDto } from '@use-cases/random-matching/dto/cancel-match-making-request.dto'
import { RequestMatchMakingRequestDto } from '@use-cases/random-matching/dto/request-match-making-request.dto'
import { SpeedUpMatchMakingRequestDto } from '@use-cases/random-matching/dto/speed-up-match-making-request.dto'
import { RandomMatchingUsecase } from '@use-cases/random-matching/random-matching.use-case'
import { TCURRENT_USER_CONTEXT_TYPE } from '@use-cases/user/constant/user.constant'
import { HttpBaseResponse } from 'src/http/http-base.response'

@Controller('match-making-room')
export class MatchMakingRoomController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly randomMatchingUsecase: RandomMatchingUsecase,
  ) {}

  @Put('request')
  async requestMatchMaking(
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
    @Body() body: RequestMatchMakingRequestDto,
  ) {
    const user_id = user.user_id
    this.logger.info({ user_id, body }, 'requestMatchMaking')

    const match_making_request_id = await this.randomMatchingUsecase.requestMatchMaking(
      user_id,
      body.type_match_making,
    )
    return new HttpBaseResponse({ match_making_request_id })
  }

  @Put('speed-up')
  async speedUp(
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
    @Body() body: SpeedUpMatchMakingRequestDto,
  ) {
    const user_id = user.user_id
    this.logger.info({ body, user_id }, 'reactProfile')

    const is_success = await this.randomMatchingUsecase.speedUpMatchMaking(user_id, body)
    return new HttpBaseResponse({ is_success })
  }

  @Put('cancel-request')
  async cancel(
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
    @Body() body: CancelMatchMakingRequestDto,
  ) {
    const user_id = user.user_id
    this.logger.info({ body, user_id }, 'reactProfile')

    const is_success = await this.randomMatchingUsecase.stopMatchMaking(
      user_id,
      body.type_match_making,
    )
    return new HttpBaseResponse({ is_success })
  }
}
