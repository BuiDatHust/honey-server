import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { GetPersonalInfoResponse } from '@core/dtos/user/get-user-info.response'
import { SetStatusRequestDto } from '@core/dtos/user/set-status-request.dto'
import { CurrentUser } from '@decorators/current-user.decorator'
import { OnboardPending } from '@decorators/onboard-pending.decorator'
import { User } from '@frameworks/data-servies/mongodb/models/user.model'
import { Body, Controller, Get, Post, Put } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthUseCase } from '@use-cases/auth/auth.use-case'
import { OnboardRequestDto } from '@use-cases/auth/dto/on-board-request.dto'
import { UpdateUserSettingRequestDto } from '@use-cases/user-setting/dto/update-user-setting-request.dto'
import { UserSettingUsecase } from '@use-cases/user-setting/user-setting.use-case'
import { TCURRENT_USER_CONTEXT_TYPE } from '@use-cases/user/constant/user.constant'
import { UserUsecase } from '@use-cases/user/user.use-case'
import { toPlain } from 'src/helpers/transform.helper'
import { HttpBaseResponse } from 'src/http/http-base.response'
import { SuccessResponse } from 'src/http/success.response'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly authUserCases: AuthUseCase,
    private readonly userUsecases: UserUsecase,
    private readonly userSettingUsecases: UserSettingUsecase,
  ) {
    this.logger.setContext(UserController.name)
  }

  @OnboardPending()
  @ApiResponse({ type: SuccessResponse, description: 'onboard user' })
  @Post('onboard')
  async onboard(@Body() body: OnboardRequestDto, @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE) {
    this.logger.info({ body }, 'onboard')
    await this.authUserCases.handleOnBoard(body, user.phone_number, user.country_code)
    return new HttpBaseResponse(new SuccessResponse())
  }

  @ApiResponse({ type: GetPersonalInfoResponse, description: 'get personal info of user' })
  @Get('personal-info')
  async info(@CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE) {
    this.logger.info({}, 'info')
    const data = await this.userUsecases.getPersonalInfo(user.user_id)
    const response = toPlain<GetPersonalInfoResponse, User>(GetPersonalInfoResponse, data)
    response.location = data.location.coordinates
    response.coordinates = data.location.coordinates
    console.log(response.coordinates)
    return new HttpBaseResponse(response)
  }

  @ApiResponse({ type: SuccessResponse, description: 'update personal setting of user' })
  @Put('user-setting')
  async updateUserSetting(
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
    @Body() body: UpdateUserSettingRequestDto,
  ) {
    this.logger.info({ body }, 'updateUserSetting')

    await this.userSettingUsecases.updateUserSetting(user.user_id, body)
    return new HttpBaseResponse(new SuccessResponse())
  }

  @Put('status')
  async setStatus(
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
    @Body() body: SetStatusRequestDto,
  ) {
    await this.userUsecases.setStatus(user.user_id, body.status)
    return new HttpBaseResponse(new SuccessResponse())
  }
}
