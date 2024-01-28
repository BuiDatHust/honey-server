import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { CurrentUser } from '@decorators/current-user.decorator'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { BuyFeatureRequestDto } from '@use-cases/feature/dto/buy-feature-request.dto'
import { FeatureUsecase } from '@use-cases/feature/feature.use-case'
import { TCURRENT_USER_CONTEXT_TYPE } from '@use-cases/user/constant/user.constant'
import { SuccessResponse } from 'src/http/success.response'

@ApiTags('feature')
@Controller('feature')
export class FeatureController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly featureUsecase: FeatureUsecase,
  ) {
    this.logger.setContext(FeatureController.name)
  }

  @Post('buy')
  async buy(@Body() body: BuyFeatureRequestDto, @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE) {
    this.logger.info({ body }, 'buy')
    await this.featureUsecase.buy(body, user.user_id)
    return new SuccessResponse()
  }
}
