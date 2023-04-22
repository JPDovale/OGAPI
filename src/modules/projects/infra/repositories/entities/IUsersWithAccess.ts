import { type ProjectUsersView } from '@prisma/client'

export interface IUserInProject {
  avatar_url: string | null
  email?: string
  id: string
  username?: string
}
export interface IProjectUsers extends ProjectUsersView {
  users: IUserInProject[]
}
