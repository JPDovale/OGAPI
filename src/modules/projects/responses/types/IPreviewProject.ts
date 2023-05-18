export interface IPreviewProject {
  id: string
  image_url: string | null
  initial_date: string
  initial_date_timestamp: string
  name: string
  type: string
  created_at: Date
  features_using: string
  user: {
    avatar_url: string | null
    username: string
    id: string
    name: string
    email: string
  }
  _count: {
    books: number
    persons: number
    timeLines: number
  }
  users_with_access_comment: {
    users: Array<{ avatar_url: string | null; id: string; username: string }>
  } | null
  users_with_access_edit: {
    users: Array<{ avatar_url: string | null; id: string; username: string }>
  } | null
  users_with_access_view: {
    users: Array<{ avatar_url: string | null; id: string; username: string }>
  } | null
}
