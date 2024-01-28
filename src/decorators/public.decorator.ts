import { SetMetadata } from '@nestjs/common'
import { IS_PUBLIC_KEY } from '../use-cases/token/constant/token.constant'

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
