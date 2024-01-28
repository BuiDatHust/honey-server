import { IDataServices } from '@core/abstracts'
import { IInMemoryDataServices } from '@core/abstracts/in-memory-data-services.abstract'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { IRpcClientService } from '@core/abstracts/rpc-client-services.abstract'
import { CreateUserDto } from '@core/dtos/user/create-user.dto'
import { UpdateUserOnboardingDto } from '@core/dtos/user/update-user-onboarding.dto'
import { UNIT_DISTANCE } from '@frameworks/data-servies/mongodb/constant/account-setting.constant'
import {
  USER_STATUS,
  mapFieldToWeightProfile,
} from '@frameworks/data-servies/mongodb/constant/user.constant'
import { SearchSetting } from '@frameworks/data-servies/mongodb/models/search-setting.model'
import { User } from '@frameworks/data-servies/mongodb/models/user.model'
import { PREFIX_KEY_REDIS } from '@frameworks/in-memory-data-services/redis/constant/key.constant'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { UpdateProfileRequestDto } from '@use-cases/auth/dto/update-profile-request.dto'
import { DEFAULT_LIST_RECOMMEND_RANDOM } from '@use-cases/random-matching/constant/random-matching.constant'
import { getCurrentMilisecondTime, getDiffirentTime } from 'src/helpers/datetime.helper'
import { DEFAULT_LIST_RECOMMEND } from './constant/user.constant'
import { UserFactoryService } from './user-factory.service'

@Injectable()
export class UserUsecase {
  constructor(
    private readonly logger: ILoggerService,
    private dataService: IDataServices,
    private userFactoryService: UserFactoryService,
    private readonly iInmemoryDataService: IInMemoryDataServices,
    private readonly rpcClientService: IRpcClientService,
    private readonly inmemoryDataService: IInMemoryDataServices,
  ) {
    this.logger.setContext(UserUsecase.name)
  }

  public async createUser(dto: CreateUserDto): Promise<User> {
    this.logger.debug({ dto }, 'createUser')
    const attribute = this.userFactoryService.createUser(dto)
    const user = await this.dataService.users.create(attribute)

    return user
  }

  public async updateUserOnboard(dto: UpdateUserOnboardingDto) {
    this.logger.debug({ dto }, 'updateUser')
    const attribute = this.userFactoryService.updateUserOnboard(dto)
    attribute.completation_percentage = this.caculateCompletationPercentage(Object.keys(attribute))
    attribute.age = getDiffirentTime(getCurrentMilisecondTime(), attribute.dob, 'years')
    attribute.show_medias = attribute.medias.filter(media => media.height)

    if (dto.email) {
      const existedUserWithEmail = await this.dataService.users.getOne({
        email: dto.email,
        _id: { $ne: dto.id },
      })
      if (existedUserWithEmail) {
        throw new BadRequestException('Existed use with email!')
      }
    }

    console.log({
      ...attribute,
      $inc: { score: this.calculateScore() },
    })
    await this.dataService.users.update(dto.id, {
      ...attribute,
      $inc: { score: this.calculateScore() },
    })
    await this.dataService.wallet.create({
      user_id: dto.id,
      coin: 0,
      created_at: getCurrentMilisecondTime(),
    })

    try {
      const filter_name = this.iInmemoryDataService.getUserKeyName(
        dto.id,
        PREFIX_KEY_REDIS.USER_COCKOO_FILTER,
      )
      await this.iInmemoryDataService.createCuckooFilter(filter_name)
    } catch (error) {
      this.logger.debug({ error }, 'createCuckooFilter')
    }
  }

  public caculateCompletationPercentage(fields: string[]): number {
    let point = 0
    for (const field of fields) {
      const fieldPoint = mapFieldToWeightProfile[field]
      if (!fieldPoint) {
        continue
      }

      point += fieldPoint
    }

    return point
  }

  public calculateScore() {
    return 100
  }

  public async getOne(filter) {
    return await this.dataService.users.getOne(filter)
  }

  public async getPersonalInfo(user_id: string): Promise<User> {
    const user = await this.dataService.users.getOneWithPopulateField(
      {
        _id: user_id,
        status: { $nin: [USER_STATUS.BANNED, USER_STATUS.DELETED, USER_STATUS.HIDE] },
      },
      [
        { path: 'account_setting', strictPopulate: false },
        { path: 'notification_setting', strictPopulate: false },
        { path: 'search_setting', strictPopulate: false },
      ],
    )

    if (!user) {
      throw new NotFoundException('Not found user')
    }
    return user
  }

  public async getSwipingListProfile(
    user_id: string,
    limit: number,
  ): Promise<{
    users: User[]
    has_more: boolean
  }> {
    return this.getListRecommendProfile(user_id, limit)
  }

  public async getListRecommendProfile(
    user_id: string,
    limit = DEFAULT_LIST_RECOMMEND,
    filter = {},
  ): Promise<{
    users: User[]
    has_more: boolean
  }> {
    const user = await this.dataService.users.getOneWithPopulateField(
      {
        _id: user_id,
      },
      [{ path: 'searchSetting', strictPopulate: false }],
    )
    const searchSetting = user.searchSetting
    const { min_age_preference, max_age_preference, distance_preference, unit_distance } =
      searchSetting
    const radius =
      unit_distance === UNIT_DISTANCE.KILOMETERS
        ? distance_preference / 6378.1
        : distance_preference / 3963.2
    const query = {
      status: USER_STATUS.ACTIVE,
      _id: { $ne: user_id },
      $and: [{ age: { $lt: max_age_preference } }, { age: { $gt: min_age_preference } }],
      location: {
        $geoWithin: {
          $centerSphere: [user.location.coordinates, radius],
        },
      },
      gender: user.gender_show,
      ...filter,
    }

    const users = await this.dataService.users.getByFilterWithPopulateField(query, '_id')
    let ids = users.map(user => user._id.toString())
    const key = this.iInmemoryDataService.getUserKeyName(
      user_id.toString(),
      PREFIX_KEY_REDIS.USER_COCKOO_FILTER,
    )
    ids = ids.filter(
      async (id: string) => !this.iInmemoryDataService.checkExistCuckooFilter(key, id),
    )

    let recommedUserIds = ['65b3bff5add125eac182cb1e', '65b671442a1c4612ca7ff155', '65b67a90f34310451094cd36']
    // try {
    //   recommedUserIds = await this.rpcClientService.getListRecommendProfile(user_id, ids, limit)
    // } catch (error) {
    //   this.logger.error({ error })
    //   recommedUserIds = ids
    // }
    if (!recommedUserIds.length) {
      return {
        users: [],
        has_more: false,
      }
    }
    const result = await this.getUserByIds(recommedUserIds, user.hide_fields)

    return {
      users: result,
      has_more: true,
    }
  }

  public async getUserByIds(ids: string[], hide_fields?: string[]): Promise<User[]> {
    const populateFields = hide_fields.map(field => `-${field}`).join(' ')
    const result = await this.dataService.users.getByFilterWithPopulateField(
      { _id: { $in: ids } },
      populateFields,
    )

    return result
  }

  public async getListRecommendUserInRandomRoom(user_id: string, filter = {}): Promise<string[]> {
    const user = await this.dataService.users.getOneWithPopulateField(
      {
        _id: user_id,
      },
      [{ path: 'searchSetting', strictPopulate: false }],
    )
    const searchSetting = user.searchSetting
    const { min_age_preference, max_age_preference, distance_preference, unit_distance } =
      searchSetting
    const radius =
      unit_distance === UNIT_DISTANCE.KILOMETERS
        ? distance_preference / 6378.1
        : distance_preference / 3963.2
    const query = {
      status: USER_STATUS.ACTIVE,
      $and: [{ age: { $lt: max_age_preference } }, { age: { $gt: min_age_preference } }],
      location: {
        $geoWithin: {
          $centerSphere: [user.location.coordinates, radius],
        },
      },
      gender: user.gender_show,
      ...filter,
    }

    let users = await this.dataService.users.getByFilterWithPopulateField(query, '_id')
    if (!users.length) {
      users = await this._getUserIfNotSatisfySearchSetting(searchSetting, query, user, radius)
    }
    if (!users.length) {
      return []
    }

    let ids = users.map(user => user._id.toString())
    const key = this.inmemoryDataService.getUserKeyName(
      user_id.toString(),
      PREFIX_KEY_REDIS.USER_COCKOO_FILTER,
    )
    ids = ids.filter(
      async (id: string) => !this.inmemoryDataService.checkExistCuckooFilter(key, id),
    )

    const recommedUserIds = await this.rpcClientService.getListRecommendProfile(
      user_id.toString(),
      ids,
      DEFAULT_LIST_RECOMMEND_RANDOM,
    )
    return recommedUserIds
  }

  private async _getUserIfNotSatisfySearchSetting(
    searchSetting: SearchSetting,
    query,
    user: User,
    radius: number,
  ): Promise<User[]> {
    if (searchSetting.is_only_show_in_age && searchSetting.is_only_show_in_distance) {
      return []
    }

    let users = []
    const isShowOutOfRangeDistanceAndAge =
      !searchSetting.is_only_show_in_age && !searchSetting.is_only_show_in_distance
    const isShowOnlyOutOfRangeDistance =
      searchSetting.is_only_show_in_age && !searchSetting.is_only_show_in_distance
    const isShowOnlyOutOfRangeAge =
      !searchSetting.is_only_show_in_age && searchSetting.is_only_show_in_distance

    if (isShowOutOfRangeDistanceAndAge) {
      delete query['$and']
      delete query['location']
      query = {
        ...query,
        $or: [
          {
            $and: [
              { age: { $lt: searchSetting.max_age_preference } },
              { age: { $gt: searchSetting.min_age_preference } },
            ],
          },
          {
            location: {
              $geoWithin: {
                $centerSphere: [user.location.coordinates, radius],
              },
            },
          },
        ],
      }
    }

    if (isShowOnlyOutOfRangeDistance) {
      delete query['location']
    }

    if (isShowOnlyOutOfRangeAge) {
      delete query['$and']
    }

    users = await this.dataService.users.getByFilterWithPopulateField(query, '_id')
    return users
  }

  public async setStatus(userId: string, status: string) {
    await this.dataService.users.update(userId, { message_status: status })
  }

  public async updateProfile(userId: string, dto: UpdateProfileRequestDto) {
    // check subscription to allow custom location
    const completation_percentage = this.caculateCompletationPercentage(Object.keys(dto))
    const age = getDiffirentTime(getCurrentMilisecondTime(), dto.dob, 'years')
    const show_medias = []
    for (const media of dto.medias) {
      if (!media.url) {
        continue
      }

      show_medias.push(media)
    }
    const location = {
      type: 'Point',
      coordinates: dto.coordinates,
    }

    console.log({
      ...dto,
      completation_percentage,
      age,
      show_medias,
      location,
    })
    await this.dataService.users.update(userId, {
      ...dto,
      completation_percentage,
      age,
      show_medias,
      location,
    })
  }
}
