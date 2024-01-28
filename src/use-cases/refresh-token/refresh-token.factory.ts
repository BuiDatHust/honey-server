import { RefreshToken } from '@frameworks/data-servies/mongodb/models/refresh-token.model'
import { Injectable } from '@nestjs/common'
import { CreateRefreshTokenDto } from '@use-cases/token/dto/create-refresh-token.dto'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'

@Injectable()
export class RefreshTokenFactory {
  constructor() {}

  public createRefreshToken(data: CreateRefreshTokenDto): RefreshToken {
    const refresh_token = new RefreshToken()

    refresh_token.device_id = data.device_id
    refresh_token.refresh_token = data.refresh_token
    refresh_token.expire_at = data.expire_at
    refresh_token.created_at = getCurrentMilisecondTime()

    return refresh_token
  }
}
