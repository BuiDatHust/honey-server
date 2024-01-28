import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TokenUsecase } from '@use-cases/token/token.use-case'
import { Request } from 'express'
import {
  IS_ONBOARD_PENDING_KEY,
  IS_PUBLIC_KEY,
  TOKEN_TYPE,
} from '../use-cases/token/constant/token.constant'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenUsecase: TokenUsecase,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    const isOnboardPending = this.reflector.getAllAndOverride(IS_ONBOARD_PENDING_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this._extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    console.log(request['body']);

    const payload = await this.tokenUsecase.verifyAccessToken(token)
    if (isOnboardPending && payload.type_token != TOKEN_TYPE.ACCESS_TOKEN_ONBOARD) {
      return false
    }
    if (!isOnboardPending && payload.type_token == TOKEN_TYPE.ACCESS_TOKEN_ONBOARD) {
      return false
    }
    await this.tokenUsecase.verifyWhitelistToken(payload.device_id, token)

    request['payload'] = payload
    return true
  }

  private _extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
