export enum TYPE_TRANSACTION {
  BUY_COIN = 'buy_coin',
  BUI_PLUS = 'buy_plus',
  BUY_PREMIUM = 'buy_premium',
  BUY_FEATURE_SPEED_UP = 'buy_feature_speed_up',
  BUY_FEATURE_WATCH_HIDE_LIKED = 'buy_feature_watch_hide_liked',
  BUY_FEATURE_SWIPE = 'buy_swipe',
  BUY_FEATURE_RANDOM_CHAT = 'buy_random_chat',
  BUY_FEATURE_RANDOM_VOICE = 'buy_random_voice',
  BUY_FEATURE_RANDOM_VIDEO = 'buy_random_video',
  BUY_FEATURE_CUSTOM_LOCATION = 'buy_feature_custom_location',
  REFUND_SUBSCRIPTION = 'refund_subscription',
  REFUND_BUY_COIN = 'refund_buy_coin',
  UPGRADE_SUBSCRIPTION = 'upgrade_subscription',
}

export enum TRANSACTION_STATUS {
  PENDING = 'pending',
  PROCCESSING = 'processing',
  CANCELED = 'canceled',
  FAIL = 'fail',
  SUCCESS = 'success',
}
