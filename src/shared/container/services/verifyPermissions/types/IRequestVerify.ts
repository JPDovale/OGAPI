export interface IRequestVerify {
  userId: string
  projectId: string
  verifyPermissionTo: 'edit' | 'comment' | 'view'
  clearCache?: boolean
}
