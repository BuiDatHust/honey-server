import { IDataServices } from '@core/abstracts'
import { IInMemoryDataServices } from '@core/abstracts/in-memory-data-services.abstract'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { CreateUserDto } from '@core/dtos/user/create-user.dto'
import { UpdateUserOnboardingDto } from '@core/dtos/user/update-user-onboarding.dto'
import { TPaginateOption } from '@core/type/paginate-option.type'
import { UNIT_DISTANCE } from '@frameworks/data-servies/mongodb/constant/account-setting.constant'
import {
  USER_FIELDS,
  USER_STATUS,
  mapFieldToWeight,
} from '@frameworks/data-servies/mongodb/constant/user.constant'
import { User } from '@frameworks/data-servies/mongodb/models/user.model'
import { Injectable, NotFoundException } from '@nestjs/common'
import { SearchSettingUserUsecase } from '@use-cases/search-setting-user/search-setting-user.use-case'
import { instanceToPlain } from 'class-transformer'
import { Types } from 'mongoose'
import { getCurrentMilisecondTime, getDiffirentTime } from 'src/helpers/datetime.helper'
import { USER_COCKOO_FILTER_PREFIX_KEY } from './constant/user.constant'
import { UserFactoryService } from './user-factory.service'

@Injectable()
export class UserUsecase {
  constructor(
    private readonly logger: ILoggerService,
    private dataService: IDataServices,
    private userFactoryService: UserFactoryService,
    private searchSettingUsecase: SearchSettingUserUsecase,
    private readonly iInmemoryDataService: IInMemoryDataServices,
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
    const plain = instanceToPlain(attribute)
    attribute.completation_percentage = this.caculateCompletationPercentage(Object.keys(plain))
    attribute.age = getDiffirentTime(getCurrentMilisecondTime(), plain.dob, 'years')

    await this.dataService.users.update(dto.id, {
      $set: attribute,
      $inc: { score: this.calculateScore() },
    })

    try {
      const filter_name = this.iInmemoryDataService.getCuckooFilterName(dto.id)
      await this.iInmemoryDataService.createCuckooFilter(filter_name)
    } catch (error) {
      this.logger.debug({ error }, 'createCuckooFilter')
    }
  }

  public caculateCompletationPercentage(fields: string[]): number {
    const percentage = fields.reduce((prev, curr) => {
      const field = USER_FIELDS?.[curr]
      if (!field) {
        return prev
      }

      const point = mapFieldToWeight[field]
      return point + prev
    }, 0)

    return percentage
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
        status: { $in: [USER_STATUS.ACTIVE, USER_STATUS.HIDE] },
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

  // todo: hide field user, check already match, check total view proifile in day
  public async getListProfile(
    user_id: string,
    paginateOptions: TPaginateOption,
  ): Promise<{
    users: User[]
    has_more: boolean
    next_cursor: number | null
  }> {
    const limit = paginateOptions.limit || 20
    const [searchSetting, user] = await Promise.all([
      this.searchSettingUsecase.getOneByFilter({
        user_id: new Types.ObjectId(user_id),
      }),
      this.getOne({ _id: new Types.ObjectId(user_id) }),
    ])

    const { min_age_preference, max_age_preference, distance_preference, unit_distance } =
      searchSetting
    const radius =
      unit_distance === UNIT_DISTANCE.KILOMETERS
        ? distance_preference / 6378.1
        : distance_preference / 3963.2
    console.log(radius)
    const filter: any = {
      status: USER_STATUS.ACTIVE,
      $and: [{ age: { $lt: max_age_preference } }, { age: { $gt: min_age_preference } }],
      location: {
        $geoWithin: {
          $centerSphere: [user.location.coordinates, radius],
        },
      },
      gender: user.gender_show,
    }
    if (paginateOptions.cursor) {
      filter.updated_at = { $gte: paginateOptions.cursor }
    }
    paginateOptions.order.updated_at = 1
    paginateOptions.order.score = -1

    const result = await this.dataService.users.getAllByPaginate(filter, {
      limit: limit + 1,
      order: paginateOptions.order,
    })
    const has_more = result.length === limit + 1
    let next_cursor = null
    if (has_more) {
      const next_cursor_record = result[limit]
      next_cursor = next_cursor_record.updated_at
      result.pop()
    }

    return {
      users: result,
      has_more,
      next_cursor,
    }
  }

  public getCuckooFilterKey(user_id: string): string {
    return `${USER_COCKOO_FILTER_PREFIX_KEY}${user_id}`
  }
}
