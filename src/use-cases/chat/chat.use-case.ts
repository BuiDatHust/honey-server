import { IDataServices } from '@core/abstracts'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { IMessageBrokerService } from '@core/abstracts/message-broker-services.abstract'
import { TPaginateOption } from '@core/type/paginate-option.type'
import { TYPE_MESSAGE } from '@frameworks/data-servies/mongodb/constant/chat.constant'
import { USER_STATUS } from '@frameworks/data-servies/mongodb/constant/user.constant'
import { ChatSetting } from '@frameworks/data-servies/mongodb/models/chat-setting.model'
import { Message } from '@frameworks/data-servies/mongodb/models/message.model'
import { BadGatewayException, Injectable, OnModuleInit } from '@nestjs/common'
import { SendMessageDto } from '@use-cases/chat/dto/send-message.dto'
import { FRIEND_STATUS } from '@use-cases/user/constant/user.constant'
import { PopulateOptions, Types } from 'mongoose'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'

@Injectable()
export class ChatUsecase implements OnModuleInit {
  constructor(
    private readonly logger: ILoggerService,
    private readonly dataService: IDataServices,
    private readonly rmqClientService: IMessageBrokerService,
  ) {}

  onModuleInit() {
    this.logger.setContext(ChatUsecase.name)
  }

  public async handleSendMessage(
    payload: SendMessageDto,
    sender_user_id: string,
  ): Promise<Message | null> {
    const { user_id, content, type_content, type_message } = payload
    const _userId = new Types.ObjectId(user_id)
    const _senderId = new Types.ObjectId(sender_user_id)
    const reciever = await this.dataService.users.getOne({
      _id: user_id,
      status: USER_STATUS.ACTIVE,
    })
    if (!reciever) {
      return
    }

    let friend
    if (payload.type_message == TYPE_MESSAGE.PRIVATE) {
      friend = await this.dataService.friends.getOne({
        $or: [
          {
            source_user: _userId,
            target_user: _senderId,
          },
          {
            source_user: _senderId,
            target_user: _userId,
          },
        ],
        status: FRIEND_STATUS.ACTIVE,
      })
      if (!friend) {
        return
      }
    }

    const messageAttr: Message = {
      sender_user_id: _senderId,
      reciever_user_id: _userId,
      content,
      type_content,
      type_message,
      created_at: getCurrentMilisecondTime(),
    }
    if (friend) {
      messageAttr.chat_seeting_id = friend.chat_seeting_id
    }

    const message = await this.dataService.messages.create(messageAttr)
    if (friend && payload.type_message === TYPE_MESSAGE.PRIVATE) {
      await this.dataService.chatSetting.update(friend.chat_seeting_id, {
        last_send_message_at: getCurrentMilisecondTime(),
        last_message_id: message._id,
      })
      if (!friend.is_chatted) {
        await this.dataService.friends.update(friend._id, { is_chatted: true })
      }
    }
    this.rmqClientService.publish('new-message-notification', 'aaa')
    return message
  }

  public async getAllChat(
    userId: string,
    paginateOption: TPaginateOption,
  ): Promise<{ data: ChatSetting[]; next_cursor?: string; has_more: boolean }> {
    const _userId = new Types.ObjectId(userId)
    const filter = {
      $or: [
        {
          first_user_id: _userId,
        },
        {
          second_user_id: _userId,
        },
      ],
      last_send_message_at: { $ne: null },
    }
    const keyOperator = '$lt'
    paginateOption.order._id == -1
    if (paginateOption.cursor) {
      filter['_id'] = { [keyOperator]: new Types.ObjectId(paginateOption.cursor) }
    }

    const populates: PopulateOptions[] = [
      {
        path: 'first_user_id',
        select: 'firstname message_status show_medias',
      },
      {
        path: 'second_user_id',
        select: 'firstname message_status show_medias',
      },
      {
        path: 'last_message_id',
        options: { limit: 1, sort: { _id: -1 } },
      },
    ]

    const chats = await this.dataService.chatSetting.getAllByPaginate({
      filter,
      option: paginateOption,
      populates,
    })
    chats.forEach((chat: any) => {
      if (chat.first_user_id._id !== userId) {
        chat.user = chat.first_user_id
      } else {
        chat.user = chat.second_user_id
      }
    })
    const response: {
      data: ChatSetting[]
      next_cursor?: string
      has_more: boolean
    } = { data: chats, has_more: false }
    if (!chats.length) {
      return response
    }

    const lastElementId = chats[chats.length - 1]._id
    if (chats.length < paginateOption.limit) {
      return response
    }

    const isExistNextUser = await this.dataService.chatSetting.getOne({
      ...filter,
      _id: { [keyOperator]: new Types.ObjectId(lastElementId) },
    })
    if (!isExistNextUser) {
      return response
    }

    response.has_more = true
    return {
      data: chats,
      has_more: true,
      next_cursor: lastElementId.toString(),
    }
  }

  public async getChatSetting(userId: string, chatId: string): Promise<ChatSetting> {
    const _chatId = new Types.ObjectId(chatId)
    const _userId = new Types.ObjectId(userId)
    const populates: PopulateOptions[] = [
      {
        path: 'first_user_id',
        select: 'firstname message_status medias',
      },
      {
        path: 'second_user_id',
        select: 'firstname message_status medias',
      },
    ]

    const existChat = await this.dataService.chatSetting.getOneWithPopulateField(
      {
        _id: _chatId,
        $or: [{ first_user_id: _userId }, { second_user_id: _userId }],
      },
      populates,
    )
    if (!existChat) {
      throw new BadGatewayException('Not exist chat')
    }

    return existChat
  }

  public async getMessageInchat(
    userId: string,
    chatId: string,
    paginateOption: TPaginateOption,
  ): Promise<{ data: Message[]; next_cursor?: string; has_more: boolean }> {
    const _chatId = new Types.ObjectId(chatId)
    const _userId = new Types.ObjectId(userId)

    // todo: add status of chat setting
    const existChat = await this.dataService.chatSetting.getOne({
      _id: _chatId,
      $or: [{ first_user_id: _userId }, { second_user_id: _userId }],
    })
    if (!existChat) {
      throw new BadGatewayException('Not exist chat')
    }

    const filter = {
      chat_seeting_id: _chatId,
      $or: [{ sender_user_id: _userId }, { reciever_user_id: _userId }],
    }
    const keyOperator = '$lt'
    paginateOption.order._id == -1
    if (paginateOption.cursor) {
      filter['_id'] = { [keyOperator]: new Types.ObjectId(paginateOption.cursor) }
    }

    const messages = await this.dataService.messages.getAllByPaginate({
      filter,
      option: paginateOption,
    })
    const response: {
      data: Message[]
      next_cursor?: string
      has_more: boolean
    } = { data: messages, has_more: false }
    if (!messages.length) {
      return response
    }

    const lastElementId = messages[messages.length - 1]._id
    if (messages.length < paginateOption.limit) {
      return response
    }

    const isExistNextMessage = await this.dataService.messages.getOne({
      ...filter,
      _id: { [keyOperator]: new Types.ObjectId(lastElementId) },
    })
    if (!isExistNextMessage) {
      return response
    }

    response.has_more = true
    response.next_cursor = lastElementId.toString()
    return response
  }
}
