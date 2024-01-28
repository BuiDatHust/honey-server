import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { GetAllProfileRequestDto } from '@core/dtos/profile/get-all-profile-request.dto'
import { ReactProfileRequestDto } from '@core/dtos/profile/react-profile-request.dto'
import { ReactProfileResponse } from '@core/dtos/profile/react-profile-response.dto'
import { TPaginateOption } from '@core/type/paginate-option.type'
import { CurrentUser } from '@decorators/current-user.decorator'
import { Body, Controller, Get, Put, Query } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { UpdateProfileRequestDto } from '@use-cases/auth/dto/update-profile-request.dto'
import { FriendUsecase } from '@use-cases/friend/friend.use-case'
import { TCURRENT_USER_CONTEXT_TYPE } from '@use-cases/user/constant/user.constant'
import { UserUsecase } from '@use-cases/user/user.use-case'
import { HttpBaseResponse } from 'src/http/http-base.response'
import { PaginationResponse } from 'src/http/paginate-cursor.response'
import { SuccessResponse } from 'src/http/success.response'

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly userUsecase: UserUsecase,
    private readonly friendUsecase: FriendUsecase,
  ) {}

  @Get('list')
  async list(
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
    @Query() query: GetAllProfileRequestDto,
  ) {
    this.logger.info({}, 'list')
    const paginateOptions: TPaginateOption = {
      cursor: query.cursor,
      limit: +query.limit || 20,
      order: {},
    }

    const result = await this.userUsecase.getSwipingListProfile(user.user_id, paginateOptions.limit)
    return new PaginationResponse(result.users, {
      has_more: result.has_more,
    })
  }

  @ApiResponse({ type: ReactProfileResponse, description: 'react profile user' })
  @Put('reaction')
  async reactProfile(
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
    @Body() body: ReactProfileRequestDto,
  ) {
    this.logger.info({ body }, 'reactProfile')

    const user_id = user.user_id
    const result = await this.friendUsecase.reactProfile(user_id, body)
    return new HttpBaseResponse({
      is_matching: result.is_matching,
      chat_setting_id: result?.chat_setting_id,
    })
  }

  @Put('')
  async update(
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
    @Body() body: UpdateProfileRequestDto,
  ) {
    this.logger.info({ body }, 'update')

    const user_id = user.user_id
    await this.userUsecase.updateProfile(user_id, body)
    return new SuccessResponse()
  }
}
