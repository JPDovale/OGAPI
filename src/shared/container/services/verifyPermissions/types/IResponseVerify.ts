import { type IUserEssentialInfos } from '@modules/accounts/infra/repositories/entities/IUserEssentialInfos'
import { type IProjectToVerifyPermission } from '@modules/projects/infra/repositories/entities/IProjectToVerifyPermission'

export interface IResponseVerify {
  project: IProjectToVerifyPermission
  user: IUserEssentialInfos
}
