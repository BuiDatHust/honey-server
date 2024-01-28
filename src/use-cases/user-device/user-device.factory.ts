import { UserDevice } from '@frameworks/data-servies/mongodb/models/user-device.model'
import { Injectable } from '@nestjs/common'
import { CreateUserDeviceDto } from '@use-cases/user-device/dto/create-user-device.dto'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'

@Injectable()
export class UserDeviceFactory {
  constructor() {}

  public createUserDevice(data: CreateUserDeviceDto): UserDevice {
    const userDevice = new UserDevice()
    userDevice.device_id = data.device_id
    userDevice.user_id = data.user_id
    userDevice.device_name = data.device_name
    userDevice.created_at = getCurrentMilisecondTime()

    return userDevice
  }
}
