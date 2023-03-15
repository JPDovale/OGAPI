import { type IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'

export interface IArchive {
  images: IAvatar[]
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
