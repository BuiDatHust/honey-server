import { Types } from 'mongoose'

class Media {
  url: string
  width: number
  height: number
}

class Location {
  type: string
  coordinates: number[]
}

export class UserEntity {
  _id: Types.ObjectId
  phone_number: string
  email: string
  country_code: string
  first_name?: string
  age?: number
  dob?: number
  medias?: Media[]
  media_order?: number[]
  gender?: string
  gender_show?: string
  height?: number
  sexual_orientation?: string
  relationship_goal?: string
  description?: string
  passions?: string[]
  company?: string
  job_title?: string
  address?: string
  languages?: string[]
  location?: Location
  visualization_fields?: string[]
  completation_percentage?: number
  is_verified?: string
  status?: string
  banned_at?: string
  unban_at?: string
  is_verified_phone?: boolean
  is_verified_email?: boolean
  created_at: string
  updated_at?: string
  deleted_at?: string
}
