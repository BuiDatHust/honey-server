import { SetMetadata } from '@nestjs/common'
import { IS_ONBOARD_PENDING_KEY } from '../use-cases/token/constant/token.constant'

export const OnboardPending = () => SetMetadata(IS_ONBOARD_PENDING_KEY, true)
