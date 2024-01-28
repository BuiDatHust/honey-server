export enum PASSIONS {
  HIP_HOP = 'HIP_HOP',
  POP = 'POP',
  K_POP = 'K_POP',
  COFFE = 'COFFE',
  TIKTOK = 'TIKTOK',
  TWITTER = 'TWITTER',
}

export enum GENDER {
  MAN = 'MAN',
  WOMAN = 'WOMAN',
  TRANS = 'TRANS',
  TRANS_MAN = 'TRANS_MAN',
  TRANS_WOMAN = 'TRANS_WOMAN',
  AGENDER = 'AGENDER',
  OTHER = 'OTHER',
}

export enum SEXUAL_ORIENTATION {
  STRAIGHT = 'STRAIGHT',
  GAY = 'GAY',
  LESBIAN = 'LESBIAN',
  BISEXUAL = 'BISEXUAL',
  ASEXUAL = 'ASEXUAL',
}

export enum RELATIONSHIP_GOAL {
  LONG_TERM_PARTNER = 'LONG_TERM_PARTNER',
  LONG_TERM_OPEN_TO_SHORT = 'LONG_TERM_OPEN_TO_SHORT',
  SHORT_TERM_OPEN_TO_LONG = 'SHORT_TERM_OPEN_TO_LONG',
  SHORT_TERM_FUN = 'SHORT_TERM_FUN',
  NEW_FRIEND = 'NEW_FRIEND',
  STILL_FIGURE_OUT = 'STILL_FIGURE_OUT',
}

export enum USER_STATUS {
  ACTIVE = 'active',
  ONBOARD_PENDING = 'onboard_pending',
  BANNED = 'banned',
  HIDE = 'hide',
  DELETED = 'deleted',
}

export enum USER_FIELDS {
  MEDIA = 'media',
  DESC = 'description',
  PASSIONS = 'passions',
  GENDER = 'gender',
  GENDER_SHOW = 'gender_show',
  DOB = 'dob',
  SEXUAL_ORIENTATION = 'sexual_orientation',
  RELATIONSHIP_GOAL = 'relationship_goal',
  LANGUAGES = 'languages',
  ADDRESS = 'address',
  COMPANY = 'company',
  JOB_TITLE = 'job_title',
  SCORE = 'score',
}

export const mapFieldToWeightProfile = {
  [USER_FIELDS.MEDIA]: 15,
  [USER_FIELDS.DESC]: 5,
  [USER_FIELDS.PASSIONS]: 8,
  [USER_FIELDS.GENDER]: 8,
  [USER_FIELDS.GENDER_SHOW]: 8,
  [USER_FIELDS.DOB]: 5,
  [USER_FIELDS.SEXUAL_ORIENTATION]: 12,
  [USER_FIELDS.RELATIONSHIP_GOAL]: 12,
  [USER_FIELDS.LANGUAGES]: 3,
  [USER_FIELDS.COMPANY]: 2,
  [USER_FIELDS.JOB_TITLE]: 2,
}

export const mapFieldToWeightPoint = {
  [USER_FIELDS.PASSIONS]: 0.2,
  [USER_FIELDS.SEXUAL_ORIENTATION]: 0.3,
  [USER_FIELDS.RELATIONSHIP_GOAL]: 0.3,
  [USER_FIELDS.COMPANY]: 0.05,
  [USER_FIELDS.SCORE]: 0.15,
}

export const MAX_TOTAL_MEDIA = 10
export const MIN_TOTAL_MEDIA = 2

export const BOOST_SCORE = 10
