export interface IUserEssentialInfos {
  id: string
  name: string
  email: string
  admin: boolean
  username: string
  last_payment_date: Date | null
  _count: {
    books: number
    projects: number
  }
}
