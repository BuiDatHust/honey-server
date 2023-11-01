import { CreateUserDeviceDto } from '@core/dtos/user-device/create-user-device.dto'
import { UserDevice } from '@frameworks/data-servies/mongodb/models/user-device.model'
import { Injectable } from '@nestjs/common'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'

@Injectable()
export class UserDeviceFactory {
  constructor() {}

  public createUserDevice(data: CreateUserDeviceDto): UserDevice {
    const userDevice = new UserDevice()
    userDevice.device_id = data.device_id
    userDevice.user_id = data.user_id
    userDevice.created_at = getCurrentMilisecondTime()

    return userDevice
  }
}
