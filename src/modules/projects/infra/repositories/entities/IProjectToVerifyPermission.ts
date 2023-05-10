export interface IProjectToVerifyPermission {
  id: string
  name: string
  users_with_access_view?: {
    users: Array<{
      id: string
    }>
  } | null
  users_with_access_edit?: {
    users: Array<{
      id: string
    }>
  } | null
  users_with_access_comment?: {
    users: Array<{
      id: string
    }>
  } | null
  user: {
    id: string
  }
  _count: {
    books: number
  }
}