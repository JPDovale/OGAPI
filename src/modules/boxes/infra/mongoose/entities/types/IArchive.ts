import { type IImageArchive } from '../schemas/Archive'

export interface IArchive {
  images: IImageArchive[]
  archive: {
    id: string
    title: string
    description: string
    createdAt: string
    updatedAt: string
  }
  links: Array<{
    type: 'id'
    id: string
  }>
}
