export interface IAuthorResponse {
  id: number
  user: {
    id: string
    username: string
    email: string
    avatar: {
      url: string | undefined
      alt: string
    }
  }
}
