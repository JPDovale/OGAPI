import { type IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { type IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'

export interface IResponseVerify {
  permission: 'edit' | 'comment' | string
  project: IProjectMongo
  user: IUserMongo
}
