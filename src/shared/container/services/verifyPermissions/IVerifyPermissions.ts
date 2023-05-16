import { type IRequestVerify } from './types/IRequestVerify'
import { type IResponseVerify } from './types/IResponseVerify'

export interface IVerifyPermissionsService {
  verify: ({
    projectId,
    userId,
    verifyPermissionTo,
    verifyFeatureInProject,
    clearCache,
  }: IRequestVerify) => Promise<IResponseVerify>
}
