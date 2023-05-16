import { type IFeaturesProjectUses } from '../infra/repositories/entities/IProject'

export interface IPreviewProject {
  id: string
  image_url: string | null
  name: string
  type: string
  created_at: Date
  features?: IFeaturesProjectUses
  features_using: string
  user?: {
    avatar_url: string | null
    username: string
    id: string
  }
  _count: {
    books: number
    persons: number
  }
  users_with_access_comment: {
    users: Array<{ avatar_url: string | null; id: string }>
  } | null
  users_with_access_edit: {
    users: Array<{ avatar_url: string | null; id: string }>
  } | null
  users_with_access_view: {
    users: Array<{ avatar_url: string | null; id: string }>
  } | null
}
