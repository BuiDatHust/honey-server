import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TokenUsecase } from '@use-cases/token/token.use-case'
import { Request } from 'express'
import { IS_PUBLIC_KEY } from '../use-cases/token/constant/token.constant'

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
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }

    const payload = await this.tokenUsecase.verifyAccessToken(token)
    await this.tokenUsecase.verifyWhitelistToken(payload.device_id, token)

    request['payload'] = payload

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
