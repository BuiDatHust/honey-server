import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { CurrentUser } from '@decorators/current-user.decorator'
import { Public } from '@decorators/public.decorator'
import { Body, Controller, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthUseCase } from '@use-cases/auth/auth.use-case'
import { LoginResponseDto } from '@use-cases/auth/dto/login-response.dto'
import { LoginThroughGoogleRequestDto } from '@use-cases/auth/dto/login-through-google-request.dto'
import { LogoutRequestDto } from '@use-cases/auth/dto/logout-request.dto'
import { ManualLoginRequestDto } from '@use-cases/auth/dto/manual-login-request.dto'
import { ManualRegisterRequestDto } from '@use-cases/auth/dto/manual-register-request.dto'
import { RenewTokenRequestDto } from '@use-cases/auth/dto/renew-token-request.dto'
import { TokenResponseDto } from '@use-cases/token/dto/token-response.dto'
import { TCURRENT_USER_CONTEXT_TYPE } from '@use-cases/user/constant/user.constant'
import { HttpBaseResponse } from 'src/http/http-base.response'
import { SuccessResponse } from 'src/http/success.response'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly authUserCases: AuthUseCase,
  ) {}

  @Public()
  @Post('manual-register')
  async manualRegister(@Body() body: ManualRegisterRequestDto) {
    this.logger.debug({ body }, 'manualRegister')

    const is_verified = await this.authUserCases.manualRegister(body)
    return new HttpBaseResponse({ is_verified })
  }

  @Public()
  @Put('login')
  async login(@Body() body: ManualLoginRequestDto): Promise<HttpBaseResponse<LoginResponseDto>> {
    this.logger.debug({ body }, 'login')

    const token = await this.authUserCases.manualLogin(body)
    return new HttpBaseResponse(token)
  }

  @Public()
  @Put('login-through-google')
  async googleLogin(
    @Body() body: LoginThroughGoogleRequestDto,
  ): Promise<HttpBaseResponse<LoginResponseDto>> {
    this.logger.debug({ body }, 'googleLogin')

    const token = await this.authUserCases.loginThroughGoogle(body)
    return new HttpBaseResponse(token)
  }

  @Put('logout')
  async logout(
    @Body() body: LogoutRequestDto,
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
  ): Promise<HttpBaseResponse<SuccessResponse>> {
    this.logger.debug({ body }, 'logout')

    await this.authUserCases.logout(body.logout_type, user.device_id)
    return new HttpBaseResponse(new SuccessResponse())
  }

  @Public()
  @Put('renew-token')
  async renewToken(
    @Body() body: RenewTokenRequestDto,
  ): Promise<HttpBaseResponse<TokenResponseDto>> {
    this.logger.debug({ body }, 'renewToken')

    const token = await this.authUserCases.renewToken(body.refresh_token)
    return new HttpBaseResponse(token)
  }
}
