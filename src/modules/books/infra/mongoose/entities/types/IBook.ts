import { IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { IComment } from '@modules/projects/infra/mongoose/entities/Comment'

import { IAuthorBook } from './IAuthorBook'
import { ICapitule } from './ICapitule'
import { IGenereBook } from './IGenereBook'
import { IPlotBook } from './IPlotBook'
import { IScene } from './IScene'

export interface IBook {
  id: string
  title: string
  subtitle?: string
  defaultProject: string
  literaryGenere: string
  isbn?: string
  frontCover?: IAvatar
  generes: IGenereBook[]
  authors: IAuthorBook[]
  plot: IPlotBook
  words?: string
  writtenWords?: string
  capitules: ICapitule[]
  comments: IComment[]
  createAt: string
  updateAt: string
}
