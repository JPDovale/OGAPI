import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import { type ProjectUsersView } from '@prisma/client'

export interface IProjectUsers extends ProjectUsersView {
  users: IUser[]
}
