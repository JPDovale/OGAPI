import { type IProject } from '@modules/projects/infra/repositories/entities/IProject'

export interface INotifyAll {
  title: string
  content: string
}

export interface INotifyUsersInOneProject {
  project: IProject
  title: string
  content: string
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
