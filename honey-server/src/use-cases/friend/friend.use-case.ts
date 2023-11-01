import { IDataServices } from '@core/abstracts'
import { IInMemoryDataServices } from '@core/abstracts/in-memory-data-services.abstract'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { ReactProfileRequestDto } from '@core/dtos/profile/react-profile-request.dto'
import { BadRequestException, Injectable } from '@nestjs/common'
import { TYPE_REACTION } from '@use-cases/user/constant/user.constant'
import { Types } from 'mongoose'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'

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
  //   - init chat setting
  public async reactProfile(
    user_id: Types.ObjectId,
    dto: ReactProfileRequestDto,
  ): Promise<{ is_matching: boolean }> {
    this.logger.debug({ user_id, dto }, 'reactProfile')

    const existedTargetUser = await this.dataService.users.getOne({ _id: dto.user_id })
    if (!existedTargetUser) {
      throw new BadRequestException('Not exist user!')
    }
    await this.dataService.userReations.create({
      source_user: user_id,
      target_user: dto.user_id,
      type_matching: dto.type_matching,
      type_reaction: dto.type_reaction,
      created_at: getCurrentMilisecondTime(),
    })

    const filter_name = this.iInmemoryDataService.getCuckooFilterName(user_id)
    await this.iInmemoryDataService.addToCuckooFilter(filter_name, dto.user_id)

    if (dto.type_reaction !== TYPE_REACTION.LIKE) {
      return { is_matching: false }
    }

    const existedTargetUserReaction = await this.dataService.userReations.getOne({
      source_user: dto.user_id,
      target_user: user_id,
      type_matching: dto.type_matching,
      type_reaction: dto.type_reaction,
    })
    if (!existedTargetUserReaction) {
      return { is_matching: false }
    }

    await this.dataService.friends.create({
      source_user: existedTargetUserReaction._id,
      target_user: user_id,
      type_matching: dto.type_matching,
      created_at: getCurrentMilisecondTime(),
    })
    return { is_matching: true }
  }
}
