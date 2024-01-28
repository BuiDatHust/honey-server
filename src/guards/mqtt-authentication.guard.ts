import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { MqttContext } from '@nestjs/microservices'
import { TokenUsecase } from '@use-cases/token/token.use-case'

@Injectable()
export class MQTTAuthGuard implements CanActivate {
  constructor(private tokenUsecase: TokenUsecase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToWs()
    const data = JSON.parse(request.getData<MqttContext>().getPacket().payload.toString())
    const token = data.access_token
    if (!token) {
      return false
    }

    const payload = await this.tokenUsecase.verifyAccessToken(token)
    await this.tokenUsecase.verifyWhitelistToken(payload.device_id, token)
    request['payload'] = payload

    return true
  }
}
