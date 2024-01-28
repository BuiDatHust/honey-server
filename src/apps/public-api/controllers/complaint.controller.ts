import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { CurrentUser } from '@decorators/current-user.decorator'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ComplaintUsecase } from '@use-cases/complaint/complaint.use-case'
import { ComplaintRequestDto } from '@use-cases/complaint/dto/complaint-request.dto'
import { TCURRENT_USER_CONTEXT_TYPE } from '@use-cases/user/constant/user.constant'
import { SuccessResponse } from 'src/http/success.response'

@ApiTags('complaint')
@Controller('complaint')
export class ComplaintController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly complaintUsecase: ComplaintUsecase,
  ) {
    this.logger.setContext(ComplaintController.name)
  }

  @Post('')
  async complaint(
    @Body() body: ComplaintRequestDto,
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
  ) {
    this.logger.info({ body }, 'complaint')
    await this.complaintUsecase.complaint(user.user_id, body)
    return new SuccessResponse()
  }
}
