import { CreateUserDto } from '@core/dtos/user/create-user.dto'
import { UpdateUserOnboardingDto } from '@core/dtos/user/update-user-onboarding.dto'
import { BOOST_SCORE, USER_STATUS } from '@frameworks/data-servies/mongodb/constant/user.constant'
import { User } from '@frameworks/data-servies/mongodb/models/user.model'
import { Injectable } from '@nestjs/common'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'

@Injectable()
export class UserFactoryService {
  constructor() {}

  createUser(dto: CreateUserDto): User {
    const user = new User()
    user.phone_number = dto.phone_number
    user.country_code = dto.country_code
    user.created_at = getCurrentMilisecondTime()
    user.status = USER_STATUS.ONBOARD_PENDING
    user.score = BOOST_SCORE

    return user
  }

  updateUserOnboard(dto: UpdateUserOnboardingDto): User {
    const user = new User()
    user.email = dto.email
    user.gender = dto.gender
    user.dob = dto.dob
    user.hide_fields = dto.hide_fields
    user.gender = dto.gender
    user.gender_show = dto.gender_show
    user.sexual_orientation = dto.sexual_orientation
    user.medias = dto.medias
    user.firstname = dto.first_name
    user.updated_at = getCurrentMilisecondTime()
    user.status = dto.status
    user.account_setting = dto.account_setting
    user.notification_setting = dto.notification_setting
    user.search_setting = dto.search_setting
    if (dto.location?.length) {
      user.location = {
        type: 'Point',
        coordinates: [dto.location[0], dto.location[1]],
      }
    }
    user.coordinates = user.coordinates

    return user
  }
}
