import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { OnboardRequestDto } from '@core/dtos/auth/on-board-request.dto'
import { UpdateUserSettingRequestDto } from '@core/dtos/user-setting/update-user-setting-request.dto'
import { GetPersonalInfoResponse } from '@core/dtos/user/get-user-info.response'
import { Public } from '@decorators/public.decorator'
import { User } from '@frameworks/data-servies/mongodb/models/user.model'
import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthUseCase } from '@use-cases/auth/auth.use-case'
import { UserSettingUsecase } from '@use-cases/user-setting/user-setting.use-case'
import { UserUsecase } from '@use-cases/user/user.use-case'
import { Request } from 'express'
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

  @Public()
  @Post('onboard')
  async onboard(@Body() body: OnboardRequestDto) {
    this.logger.info({ body }, 'onboard')
    await this.authUserCases.handleOnBoard(body)
    return new HttpBaseResponse(new SuccessResponse())
  }

  @ApiResponse({ type: GetPersonalInfoResponse, description: 'get personal info of user' })
  @Get('/personal-info')
  async info(@Req() req: Request) {
    const user_id = req['user_id']
    const data = await this.userUsecases.getPersonalInfo(user_id)
    const response = toPlain<GetPersonalInfoResponse, User>(GetPersonalInfoResponse, data)
    return new HttpBaseResponse(response)
  }

  @ApiResponse({ type: SuccessResponse, description: 'update personal setting of user' })
  @Put('/user-setting')
  async updateUserSetting(@Req() req: Request, @Body() body: UpdateUserSettingRequestDto) {
    this.logger.info({ body }, 'onboard')

    const user_id = req['user_id']
    await this.userSettingUsecases.updateUserSetting(user_id, body)
    return new HttpBaseResponse(new SuccessResponse())
  }
}
