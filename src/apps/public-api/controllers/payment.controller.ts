import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { CompleteOrderRequestDto } from '@use-cases/payment/dto/complete-order-request.dto'
import { CreateOrderRequestDto } from '@use-cases/payment/dto/create-order-request.dto'
import { CurrentUser } from '@decorators/current-user.decorator'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { PaymentUsecase } from '@use-cases/payment/payment.use-case'
import { TCURRENT_USER_CONTEXT_TYPE } from '@use-cases/user/constant/user.constant'
import { SuccessResponse } from 'src/http/success.response'

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly paymentUsecase: PaymentUsecase,
  ) {
    this.logger.setContext(PaymentController.name)
  }

  @Post('create-order')
  async createOrder(
    @Body() body: CreateOrderRequestDto,
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
  ) {
    this.logger.debug({ body }, 'create-order')
    await this.paymentUsecase.createOrder(user.user_id, body.value)
    return new SuccessResponse()
  }

  @Post('complete-order')
  async completeOrder(
    @Body() body: CompleteOrderRequestDto,
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
  ) {
    this.logger.debug({ body }, 'complete-order')
    await this.paymentUsecase.completeOrder(user.user_id, body.order_id)
    return new SuccessResponse()
  }

  @Post('cancel-order')
  async cancelOrder(
    @Body() body: CompleteOrderRequestDto,
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
  ) {
    this.logger.debug({ body }, 'cancelOrder')
    await this.paymentUsecase.cancelOrder(user.user_id, body.order_id)
    return new SuccessResponse()
  }
}
