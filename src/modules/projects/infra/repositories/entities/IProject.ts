import { type IBookPreview } from '@modules/books/responses/IBookPreview'
import { type IPersonPreview } from '@modules/persons/responses/IPersonPreview'
import { type ITimeLine } from '@modules/timelines/infra/repositories/entities/ITimeLine'
import { type Project } from '@prisma/client'

import { type IComment } from './IComment'
import { type IProjectUsers } from './IUsersWithAccess'

export interface IProject extends Project {
  users_with_access_view?: IProjectUsers | null
  users_with_access_edit?: IProjectUsers | null
  users_with_access_comment?: IProjectUsers | null
  comments?: IComment[]
  books?: IBookPreview[]
  persons?: IPersonPreview[]
  timeLines?: ITimeLine[]
  user?: {
    id: string
    avatar_url: string | null
    email: string
    username: string
    name: string
  }
  _count?: {
    persons?: number
    books?: number
    timeLines?: number
  }
}

export interface IFeaturesProjectUses {
  books: boolean
  plot: boolean
  planets: boolean
  nations: boolean
  persons: boolean
  citys: boolean
  races: boolean
  religions: boolean
  powers: boolean
  familys: boolean
  languages: boolean
  institutions: boolean
  timeLines: boolean
}

export type IKeysOfFeatures =
  | 'books'
  | 'plot'
  | 'planets'
  | 'nations'
  | 'persons'
  | 'citys'
  | 'races'
  | 'religions'
  | 'powers'
  | 'familys'
  | 'languages'
  | 'institutions'
  | 'timeLines'

export interface IClientProject extends IProject {
  features: IFeaturesProjectUses
}
