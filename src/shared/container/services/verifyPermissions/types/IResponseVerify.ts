import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import { type IProject } from '@modules/projects/infra/repositories/entities/IProject'

export interface IResponseVerify {
  project: IProject
  user: IUser
}
