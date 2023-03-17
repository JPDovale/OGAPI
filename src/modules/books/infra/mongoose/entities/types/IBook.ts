import { type IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { type IComment } from '@modules/projects/infra/mongoose/entities/Comment'

import { type IAuthorBook } from './IAuthorBook'
import { type ICapitule } from './ICapitule'
import { type IGenereBook } from './IGenereBook'
import { type IPlotBook } from './IPlotBook'

export interface IBook {
  id: string
  title: string
  subtitle: string
  createdPerUser: string
  defaultProject: string
  literaryGenere: string
  isbn: string
  frontCover?: IAvatar
  generes: IGenereBook[]
  authors: IAuthorBook[]
  plot: IPlotBook
  words: string
  writtenWords: string
  capitules: ICapitule[]
  comments: IComment[]
  createAt: string
  updateAt: string
  toObject: () => IBook
}
