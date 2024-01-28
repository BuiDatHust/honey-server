import { FEATURE } from '@frameworks/data-servies/mongodb/constant/feature.constant'
import { TYPE_TRANSACTION } from '@frameworks/data-servies/mongodb/constant/transaction.constant'

export const FEATURE_TO_TRANSACTION_TYPE = {
  [FEATURE.SWIPE]: TYPE_TRANSACTION.BUY_FEATURE_SWIPE,
  [FEATURE.CUSTOM_LOCATION]: TYPE_TRANSACTION.BUY_FEATURE_CUSTOM_LOCATION,
  [FEATURE.RANDOM_CHAT]: TYPE_TRANSACTION.BUY_FEATURE_RANDOM_CHAT,
  [FEATURE.RANDOM_VIDEO_CALL]: TYPE_TRANSACTION.BUY_FEATURE_RANDOM_VIDEO,
  [FEATURE.RANDOM_VOICE_CALL]: TYPE_TRANSACTION.BUY_FEATURE_RANDOM_VOICE,
  [FEATURE.WATCH_HIDE_LIKED]: TYPE_TRANSACTION.BUY_FEATURE_WATCH_HIDE_LIKED,
  [FEATURE.SPEED_UP]: TYPE_TRANSACTION.BUY_FEATURE_SPEED_UP,
}