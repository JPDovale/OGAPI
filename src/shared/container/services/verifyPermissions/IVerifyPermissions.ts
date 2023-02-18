import { IRequestVerify } from './types/IRequestVerify'
import { IResponseVerify } from './types/IResponseVerify'

export interface IVerifyPermissionsService {
  verify: ({
    projectId,
    userId,
    verifyPermissionTo,
  }: IRequestVerify) => Promise<IResponseVerify>
}
