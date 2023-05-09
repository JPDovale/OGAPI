import { type IProject } from '@modules/projects/infra/repositories/entities/IProject'
import { type IProjectToVerifyPermission } from '@modules/projects/infra/repositories/entities/IProjectToVerifyPermission'

export interface INotifyAll {
  title: string
  content: string
}

export interface INotifyUsersInOneProject {
  project: IProject | IProjectToVerifyPermission
  title: string
  content: string
  creatorId: string
}

export interface INotifyOneUser {
  title: string
  content: string
  userToNotifyId: string
}
export abstract class INotifyUsersProvider {
  abstract notifyUsersInOneProject(
    data: INotifyUsersInOneProject,
  ): Promise<void>
  abstract notifyAll({ content, title }: INotifyAll): Promise<void>
  abstract notifyOneUser(data: INotifyOneUser): Promise<void>
}
