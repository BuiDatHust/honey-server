export enum TYPE_MATCHING {
  SWIPE = 'SWIPE',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  CHAT_VOICE = 'CHAT_VOICE',
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
  user_id: string
}

export const DEFAULT_LIST_RECOMMEND = 20
