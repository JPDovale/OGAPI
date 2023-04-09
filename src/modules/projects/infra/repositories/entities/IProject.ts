import { type Project } from '@prisma/client'

import { type IProjectUsers } from './IUsersWithAccess'

export interface IProject extends Project {
  users_with_access_view?: IProjectUsers | null
  users_with_access_edit?: IProjectUsers | null
  users_with_access_comment?: IProjectUsers | null
}
