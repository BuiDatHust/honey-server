import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { TCURRENT_USER_CONTEXT_TYPE } from '@use-cases/user/constant/user.constant'

export const getCurrentUserByContext = (context: ExecutionContext): TCURRENT_USER_CONTEXT_TYPE => {
  if (context.getType() === 'http') {
    const payload = context.switchToHttp().getRequest().payload
    const user_context: TCURRENT_USER_CONTEXT_TYPE = {
      phone_number: payload.phone_number,
      device_id: payload.device_id,
      country_code: payload.country_code,
      user_id: payload.user_id,
      email: payload.email,
    }
    return user_context
  }
}

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) =>
  getCurrentUserByContext(context),
)
