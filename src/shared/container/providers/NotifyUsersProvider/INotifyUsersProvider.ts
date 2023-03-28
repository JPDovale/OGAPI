import { type IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { type IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'

export interface INotifyAll {
  sendBy: IUserMongo
  title: string
  content: string
}

export interface INotifyUsersProvider {
  notify: (
    sendBy: IUserMongo,
    project: IProjectMongo,
    title: string,
    content: string,
  ) => Promise<void>

  notifyAll: ({ content, sendBy, title }: INotifyAll) => Promise<void>
}
