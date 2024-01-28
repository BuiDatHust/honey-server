import { IDataServices } from '@core/abstracts'
import { UserDevice } from '@frameworks/data-servies/mongodb/models/user-device.model'
import { Injectable } from '@nestjs/common'
import { CreateUserDeviceDto } from '@use-cases/user-device/dto/create-user-device.dto'
import { PinoLogger } from 'nestjs-pino'
import { UserDeviceFactory } from './user-device.factory'

@Injectable()
export class UserDeviceUseCase {
  constructor(
    private readonly logger: PinoLogger,
    private dataService: IDataServices,
    private userDeviceFactory: UserDeviceFactory,
  ) {
    this.logger.setContext(UserDeviceUseCase.name)
  }

  async createUserDevice(dto: CreateUserDeviceDto): Promise<UserDevice> {
    this.logger.debug({ dto }, 'createUserDevice')
    const existedUserDevice = await this.dataService.userDevices.getOne({
      device_id: dto.device_id,
    })
    if (existedUserDevice) {
      return existedUserDevice
    }

    const attribute = this.userDeviceFactory.createUserDevice(dto)
    const userDevice = await this.dataService.userDevices.create(attribute)

    return userDevice
  }

  async getUserDeviceByFilter(filter): Promise<UserDevice> {
    return await this.dataService.userDevices.getOne(filter)
  }
}
