import { Types } from 'mongoose'

export const USER_COCKOO_FILTER_PREFIX_KEY = 'user_cockuu_filter_'

export enum TYPE_MATCHING {
  SWIPE = 'SWIPE',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  CHAT_VIDEO = 'CHAT_VIDEO',
}

export enum FRIEND_STATUS {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

export enum TYPE_REACTION {
  LIKE = 'LIKE',
  NOPE = 'NOPE',
}

export type TCURRENT_USER_CONTEXT_TYPE = {
  email: string
  phone_number: string
  country_code: string
  device_id: string
  user_id: Types.ObjectId
}
