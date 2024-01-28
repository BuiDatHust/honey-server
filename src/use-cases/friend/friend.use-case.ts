import { IDataServices } from '@core/abstracts'
import { IInMemoryDataServices } from '@core/abstracts/in-memory-data-services.abstract'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { ReactProfileRequestDto } from '@core/dtos/profile/react-profile-request.dto'
import { TPaginateOption } from '@core/type/paginate-option.type'
import { USER_STATUS } from '@frameworks/data-servies/mongodb/constant/user.constant'
import { Friend } from '@frameworks/data-servies/mongodb/models/friend.model'
import { UserReation } from '@frameworks/data-servies/mongodb/models/user-reaction.model'
import { PREFIX_KEY_REDIS } from '@frameworks/in-memory-data-services/redis/constant/key.constant'
import { BadRequestException, Injectable } from '@nestjs/common'
import { FRIEND_STATUS, TYPE_REACTION } from '@use-cases/user/constant/user.constant'
import { Types } from 'mongoose'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'
import { PENDING_REACTION_TYPE } from './constant/friend.constant'

@Injectable()
export class FriendUsecase {
  constructor(
    private readonly logger: ILoggerService,
    private readonly dataService: IDataServices,
    private readonly iInmemoryDataService: IInMemoryDataServices,
  ) {
    this.logger.setContext(FriendUsecase.name)
  }

  // todo:
  //   - send notification to both user that they has new like or new matching
  //   - update score user
  public async reactProfile(
    user_id: string,
    dto: ReactProfileRequestDto,
  ): Promise<{ is_matching: boolean; chat_setting_id?: string }> {
    this.logger.debug({ user_id, dto }, 'reactProfile')

    const existedTargetUser = await this.dataService.users.getOne({
      _id: dto.user_id,
      status: USER_STATUS.ACTIVE,
    })
    if (!existedTargetUser) {
      throw new BadRequestException('Not exist user!')
    }

    const filter_name = this.iInmemoryDataService.getUserKeyName(
      user_id,
      PREFIX_KEY_REDIS.USER_COCKOO_FILTER,
    )
    await this.iInmemoryDataService.addToCuckooFilter(filter_name, dto.user_id)

    const _userId = new Types.ObjectId(user_id)
    const _dtoUserId = new Types.ObjectId(dto.user_id)
    const existedUserReaction = await this.dataService.userReations.getOne({
      source_user: _userId,
      target_user: _dtoUserId,
      type_matching: dto.type_matching,
      type_reaction: dto.type_reaction,
      is_pending: true,
    })

    if (dto.type_reaction === TYPE_REACTION.NOPE) {
      if (!existedUserReaction) {
        await this.dataService.userReations.create({
          source_user: _userId,
          target_user: _dtoUserId,
          type_matching: dto.type_matching,
          type_reaction: dto.type_reaction,
          is_pending: true,
          created_at: getCurrentMilisecondTime(),
        })
      }
      return { is_matching: false }
    }

    const existedTargetUserReaction = await this.dataService.userReations.getOne({
      source_user: _dtoUserId,
      target_user: _userId,
      type_matching: dto.type_matching,
      type_reaction: dto.type_reaction,
      is_pending: true,
    })
    if (!existedTargetUserReaction) {
      if (!existedUserReaction) {
        await this.dataService.userReations.create({
          source_user: _userId,
          target_user: _dtoUserId,
          type_matching: dto.type_matching,
          type_reaction: dto.type_reaction,
          is_pending: true,
          created_at: getCurrentMilisecondTime(),
        })
      }

      return { is_matching: false }
    }

    await Promise.all([
      this.dataService.userReations.updateByFilter(
        { _id: existedTargetUserReaction._id },
        { is_pending: false },
      ),
      this.dataService.userReations.create({
        source_user: _userId,
        target_user: _dtoUserId,
        type_matching: dto.type_matching,
        type_reaction: dto.type_reaction,
        is_pending: false,
        created_at: getCurrentMilisecondTime(),
      }),
    ])

    const chatSetting = await this.dataService.chatSetting.create({
      first_user_id: _dtoUserId,
      second_user_id: _userId,
      created_at: getCurrentMilisecondTime(),
    })
    await this.dataService.friends.create({
      source_user: existedTargetUser._id,
      target_user: _userId,
      type_matching: dto.type_matching,
      created_at: getCurrentMilisecondTime(),
      chat_seeting_id: chatSetting._id,
    })
    return { is_matching: true, chat_setting_id: chatSetting._id.toString() }
  }

  public async getListPendingUser(
    userId: string,
    typePending: string,
    paginateOption: TPaginateOption,
  ): Promise<{
    data: UserReation[]
    next_cursor?: string
    has_more: boolean
  }> {
    this.logger.debug({ userId }, 'getListPendingUser')

    // check subscription or coin to show this feature
    paginateOption.order = { _id: -1 }
    const filter: any = {
      is_pending: true,
      type_reaction: TYPE_REACTION.LIKE,
    }
    const populates = []
    if (typePending === PENDING_REACTION_TYPE.EVERYONE_PENDING) {
      filter.target_user = new Types.ObjectId(userId)
      populates.push({
        path: 'source_user',
        select: 'firstname show_medias',
        strictPopulate: false,
      })
    }
    if (typePending === PENDING_REACTION_TYPE.ME_PENDING) {
      filter.source_user = new Types.ObjectId(userId)
      populates.push({
        path: 'target_user',
        select: 'firstname show_medias',
        strictPopulate: false,
      })
    }
    if (paginateOption.cursor) {
      filter['_id'] = { $lt: new Types.ObjectId(paginateOption.cursor) }
    }

    let pendingUserReactions: any = await this.dataService.userReations.getAllByPaginate({
      filter,
      option: paginateOption,
      populates,
    })
    pendingUserReactions = pendingUserReactions.map(userReaction => {
      if (typePending === PENDING_REACTION_TYPE.EVERYONE_PENDING) {
        userReaction.user = userReaction.source_user
      } else {
        userReaction.user = userReaction.target_user
      }

      return userReaction
    })
    const response: {
      data: UserReation[]
      next_cursor?: string
      has_more: boolean
    } = { data: pendingUserReactions, has_more: false }
    if (!pendingUserReactions.length) {
      return response
    }

    const lastElementId = pendingUserReactions[pendingUserReactions.length - 1]._id
    if (pendingUserReactions.length < paginateOption.limit) {
      response.next_cursor = lastElementId.toString()
      return response
    }

    const isExistNextUser = await this.dataService.userReations.getOne({
      ...filter,
      _id: { $lt: lastElementId },
    })
    if (!isExistNextUser) {
      return response
    }

    response.has_more = true
    return {
      data: pendingUserReactions,
      has_more: true,
      next_cursor: lastElementId.toString(),
    }
  }

  public async getListFriend(
    userId: string,
    paginateOption: TPaginateOption,
    is_get_recently_match = false,
  ): Promise<{
    data: Friend[]
    next_cursor?: string
    has_more: boolean
  }> {
    this.logger.debug({ userId }, 'getListFriend')

    const _userId = new Types.ObjectId(userId)
    const filter: any = {
      $or: [
        {
          source_user: _userId,
        },
        {
          target_user: _userId,
        },
      ],
      status: FRIEND_STATUS.ACTIVE,
    }
    if (is_get_recently_match) {
      filter.is_chatted = false
    }
    const keyOperator = paginateOption.order._id == 1 ? '$gt' : '$lt'
    if (paginateOption.cursor) {
      filter['_id'] = { [keyOperator]: new Types.ObjectId(paginateOption.cursor) }
    }

    let friends = await this.dataService.friends.getAllByPaginate({
      filter,
      option: paginateOption,
      populates: [
        { path: 'source_user', select: '_id firstname message_status show_medias' },
        { path: 'target_user', select: '_id firstname message_status show_medias' },
      ],
    })
    friends = friends.map((friend: any) => {
      let user: any
      if ((friend.source_user as any)._id !== userId) {
        user = friend.source_user
      } else {
        user = friend.target_user
      }
      friend.user = user

      return friend as Friend
    })
    const response: {
      data: Friend[]
      next_cursor?: string
      has_more: boolean
    } = { data: friends, has_more: false }
    if (!friends.length) {
      return response
    }

    const lastElementId = friends[friends.length - 1]._id
    if (friends.length < paginateOption.limit) {
      return response
    }

    const isExistNextUser = await this.dataService.friends.getOne({
      ...filter,
      _id: { [keyOperator]: new Types.ObjectId(lastElementId) },
    })
    if (!isExistNextUser) {
      return response
    }

    response.has_more = true
    return {
      data: friends,
      has_more: true,
      next_cursor: lastElementId.toString(),
    }
  }
}
