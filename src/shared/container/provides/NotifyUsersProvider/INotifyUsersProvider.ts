import { IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'

export interface INotifyUsersProvider {
  notify: (
    sendBy: IUserMongo,
    project: IProjectMongo,
    title: string,
    content: string,
  ) => Promise<void>
}
