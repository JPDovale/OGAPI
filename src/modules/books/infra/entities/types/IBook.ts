import { IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { IComment } from '@modules/projects/infra/mongoose/entities/Comment'

export interface IBook {
  id: string
  title: string
  subtitle?: string
  defaultProject: string
  literaryGenere: string
  isbn?: string
  frontCover?: IAvatar
  generes: any[]
  authors: any[]
  plot: any
  words?: string
  capitules: any[]
  comments: IComment[]
  createAt: string
  updateAt: string
}
