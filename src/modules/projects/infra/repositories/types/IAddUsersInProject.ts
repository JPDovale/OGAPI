import { type IUserInProject } from '../entities/IUsersWithAccess'

export interface IAddUsersInProject {
  users: IUserInProject[]
  projectId: string
  permission: 'edit' | 'view' | 'comment'
}
