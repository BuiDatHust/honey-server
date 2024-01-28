import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { CurrentUser } from '@decorators/current-user.decorator'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateNotificationTokenRequestDto } from '@use-cases/notification-token/dto/create-notification-token-request.dto'
import { UpdateNotificationTokenRequestDto } from '@use-cases/notification-token/dto/update-notification-token-request.dto'
import { NotificationTokenUsecase } from '@use-cases/notification-token/notification-token.use-case'
import { TCURRENT_USER_CONTEXT_TYPE } from '@use-cases/user/constant/user.constant'
import { SuccessResponse } from 'src/http/success.response'

@ApiTags('notification-token')
@Controller('notification-token')
export class NotificationTokenController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly notificationTokenUsecase: NotificationTokenUsecase,
  ) {}

  @Post('')
  public async create(
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
    @Body() body: CreateNotificationTokenRequestDto,
  ) {
    this.logger.info({ body }, 'create')

    await this.notificationTokenUsecase.create(user.user_id, body)
    return new SuccessResponse()
  }

  @Post('')
  public async update(
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
    @Body() body: UpdateNotificationTokenRequestDto,
  ) {
    this.logger.info({ body }, 'update')

    await this.notificationTokenUsecase.update(user.user_id, body)
    return new SuccessResponse()
  }
}
