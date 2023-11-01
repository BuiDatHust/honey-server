import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { GetAllProfileRequestDto } from '@core/dtos/profile/get-all-profile-request.dto'
import { ReactProfileRequestDto } from '@core/dtos/profile/react-profile-request.dto'
import { ReactProfileResponse } from '@core/dtos/profile/react-profile-response.dto'
import { TPaginateOption } from '@core/type/paginate-option.type'
import { CurrentUser } from '@decorators/current-user.decorator'
import { Body, Controller, Get, Put, Query, Req } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { FriendUsecase } from '@use-cases/friend/friend.use-case'
import { TCURRENT_USER_CONTEXT_TYPE } from '@use-cases/user/constant/user.constant'
import { UserUsecase } from '@use-cases/user/user.use-case'
import { Request } from 'express'
import { HttpBaseResponse } from 'src/http/http-base.response'
import { PaginationResponse } from 'src/http/paginate-cursor.response'

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly userUsecase: UserUsecase,
    private readonly friendUsecase: FriendUsecase,
  ) {
    this.logger.setContext(ProfileController.name)
  }

  @Get('list')
  async list(@Req() req: Request, @Query() query: GetAllProfileRequestDto) {
    const paginateOptions: TPaginateOption = {
      cursor: query.cursor,
      limit: +query.limit || 20,
      order: {},
    }
    const result = await this.userUsecase.getListProfile(req['user_id'], paginateOptions)

    return new PaginationResponse(result.users, {
      has_more: result.has_more,
      next_cursor: result.next_cursor,
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
    return new HttpBaseResponse({ is_matching: result.is_matching })
  }
}
