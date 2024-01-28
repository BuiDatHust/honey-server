import { IDataServices } from '@core/abstracts'
import { NOTIFICATION_TOKEN_STATUS } from '@frameworks/data-servies/mongodb/constant/notification-token.constant'
import { BadRequestException } from '@nestjs/common'
import { Types } from 'mongoose'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'
import { CreateNotificationTokenRequestDto } from './dto/create-notification-token-request.dto'
import { UpdateNotificationTokenRequestDto } from './dto/update-notification-token-request.dto'

export class NotificationTokenUsecase {
  constructor(private readonly dataService: IDataServices) {}

  public async create(userId: string, dto: CreateNotificationTokenRequestDto) {
    const notificationToken = await this.dataService.notificationToken.getOne({
      notification_token: dto.token,
      user_id: new Types.ObjectId(userId),
    })
    if (notificationToken) {
      throw new BadRequestException('Token is registered!')
    }

    await this.dataService.notificationToken.create({
      notification_token: dto.token,
      device_type: dto.device_type,
      status: dto.status,
      created_at: getCurrentMilisecondTime(),
      user_id: userId,
    })
  }

  public async update(userId: string, dto: UpdateNotificationTokenRequestDto) {
    const notificationToken = await this.dataService.notificationToken.getOne({
      notification_token: dto.token,
      user_id: new Types.ObjectId(userId),
    })
    if (!notificationToken) {
      throw new BadRequestException('Token is not exist!')
    }

    await this.dataService.notificationToken.update(notificationToken._id, {
      status: dto.is_disable
        ? NOTIFICATION_TOKEN_STATUS.ACTIVE
        : NOTIFICATION_TOKEN_STATUS.INACTIVE,
    })
  }
}
