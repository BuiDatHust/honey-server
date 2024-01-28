import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { CurrentUser } from '@decorators/current-user.decorator'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { GetListFriendRequestDto } from '@use-cases/friend/dto/get-list-friend-request.dto'
import { GetListUserPendingReactionRequestDto } from '@use-cases/friend/dto/get-list-user-pending-reaction-request.dto'
import { FriendUsecase } from '@use-cases/friend/friend.use-case'
import { TCURRENT_USER_CONTEXT_TYPE } from '@use-cases/user/constant/user.constant'
import { PaginationResponse } from 'src/http/paginate-cursor.response'

@Controller('friend')
export class FriendController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly friendUsecase: FriendUsecase,
  ) {
    this.logger.setContext(FriendController.name)
  }

  @Get('pending-reaction')
  async getListPendingReaction(
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
    @Query() query: GetListUserPendingReactionRequestDto,
  ) {
    this.logger.debug({ query }, 'getListPendingReaction')

    const DEFAULT_LIST = 20
    const MAX_PAGINATE_PAGE = 30
    const MIN_PAGINATE_PAGE = 1
    const limit = query.limit || DEFAULT_LIST
    if (limit > MAX_PAGINATE_PAGE || limit < MIN_PAGINATE_PAGE) {
      throw new BadRequestException()
    }
    const response = await this.friendUsecase.getListPendingUser(user.user_id, query.type_pending, {
      limit,
      cursor: query.cursor,
      order: {},
    })

    return new PaginationResponse(response.data, {
      has_more: response.has_more,
      next_cursor: response.next_cursor,
    })
  }

  @Get('list')
  async list(
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
    @Query() query: GetListFriendRequestDto,
  ) {
    this.logger.debug({ query }, 'list')

    const DEFAULT_LIST = 20
    const MAX_PAGINATE_PAGE = 30
    const MIN_PAGINATE_PAGE = 1
    const limit = query.limit || DEFAULT_LIST
    if (limit > MAX_PAGINATE_PAGE || limit < MIN_PAGINATE_PAGE) {
      throw new BadRequestException()
    }

    const order = query.order || -1
    if (order !== 1 && order != -1) {
      throw new BadRequestException()
    }

    const response = await this.friendUsecase.getListFriend(
      user.user_id,
      {
        limit,
        cursor: query.cursor,
        order: { _id: order },
      },
      query.is_get_recently_match,
    )

    return new PaginationResponse(response.data, {
      has_more: response.has_more,
      next_cursor: response.next_cursor,
    })
  }
}
