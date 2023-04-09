import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'

export interface IAddUsersInProject {
  users: IUser[]
  projectId: string
  permission: 'edit' | 'view' | 'comment'
}
