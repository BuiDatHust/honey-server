import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { Public } from '@decorators/public.decorator'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SendOtpRequestDto } from '@use-cases/otp/dto/send-otp-request.dto'
import { OtpUseCase } from '@use-cases/otp/otp.use-case'
import { SuccessResponse } from 'src/http/success.response'

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly otpUsecase: OtpUseCase,
  ) {
    this.logger.setContext(OtpController.name)
  }

  @Public()
  @Post('send')
  async send(@Body() body: SendOtpRequestDto) {
    this.logger.debug({ body }, 'send')
    await this.otpUsecase.sendOtp(body)
    return new SuccessResponse()
  }
}
