import { type IKeysOfFeatures } from '@modules/projects/infra/repositories/entities/IProject'

export interface IRequestVerify {
  userId: string
  projectId: string
  verifyPermissionTo: 'edit' | 'comment' | 'view'
  verifyFeatureInProject?: IKeysOfFeatures[]
  clearCache?: boolean
}
