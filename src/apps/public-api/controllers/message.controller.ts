import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { CurrentUser } from '@decorators/current-user.decorator'
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ChatUsecase } from '@use-cases/chat/chat.use-case'
import { GetListMessageInChatRequestDto } from '@use-cases/chat/dto/get-list-message-in-chat-request.dto'
import { TCURRENT_USER_CONTEXT_TYPE } from '@use-cases/user/constant/user.constant'
import { PaginationResponse } from 'src/http/paginate-cursor.response'

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly chatUsecase: ChatUsecase,
  ) {}

  @Get('/list-in-chat/:chatId')
  public async listMessage(
    @CurrentUser() user: TCURRENT_USER_CONTEXT_TYPE,
    @Query() query: GetListMessageInChatRequestDto,
    @Param('chatId') chatId: string,
  ) {
    this.logger.info({}, 'list')

    const DEFAULT_LIST = 20
    const MAX_PAGINATE_PAGE = 30
    const MIN_PAGINATE_PAGE = 1
    const limit = query.limit || DEFAULT_LIST
    if (limit > MAX_PAGINATE_PAGE || limit < MIN_PAGINATE_PAGE) {
      throw new BadRequestException()
    }

    const result = await this.chatUsecase.getMessageInchat(user.user_id, chatId, {
      cursor: query.cursor,
      limit,
      order: {},
    })
    return new PaginationResponse(result.data, {
      has_more: result.has_more,
      next_cursor: result?.next_cursor,
    })
  }
}
