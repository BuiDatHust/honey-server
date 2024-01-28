import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { CurrentUser } from '@decorators/current-user.decorator'
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RegiterSubscriptionRequestDto } from '@use-cases/subscription/dto/register-subscription-request.dto'
import { UpgradeSubscriptionRequestDto } from '@use-cases/subscription/dto/upgrade-subscription-request.dto'
import { SubscriptionUsecase } from '@use-cases/subscription/subscription.use-case'
import { TCURRENT_USER_CONTEXT_TYPE } from '@use-cases/user/constant/user.constant'
import { HttpBaseResponse } from 'src/http/http-base.response'
import { SuccessResponse } from 'src/http/success.response'

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly subscriptionUsecase: SubscriptionUsecase,
  ) {
    this.logger.setContext(SubscriptionController.name)
  }

  @Post('register')
  async register(
    @Body() body: RegiterSubscriptionRequestDto,
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
  ) {
    this.logger.debug({ body }, 'register')
    await this.subscriptionUsecase.registerSubscription(body, user.user_id)
    return new SuccessResponse()
  }

  @Delete('/cancel/:subscription_id')
  async cancelSubscription(
    @Param('subscription_id') subscription_id: string,
    @CurrentUser()
    user: TCURRENT_USER_CONTEXT_TYPE,
  ) {
    this.logger.debug({}, 'cancelSubscription')
    await this.subscriptionUsecase.cancelSubscription(subscription_id, user.user_id)
    return new SuccessResponse()
  }

  @Get('/current')
  async getCurrentSubscription(@CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE) {
    this.logger.debug({}, 'getCurrentSubscription')
    const subscription = await this.subscriptionUsecase.getCurrentSubscription(user.user_id)
    return new HttpBaseResponse(subscription)
  }

  @Get('/system')
  async getSystemSubscription() {
    this.logger.debug({}, 'getSystemSubscription')
    const subscriptions = this.subscriptionUsecase.getSubscriptions()
    return new HttpBaseResponse(subscriptions)
  }

  @Post('/upgrade')
  async upgrade(
    @Body() body: UpgradeSubscriptionRequestDto,
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
  ) {
    this.logger.info({ body }, 'upgrade')
    await this.subscriptionUsecase.upgradeSubscription(body, user.user_id)
    return new SuccessResponse()
  }
}
