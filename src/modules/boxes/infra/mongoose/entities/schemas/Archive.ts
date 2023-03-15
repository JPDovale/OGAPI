import { type IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'

interface IArchiveConstructor {
  images?: IAvatar[]
  archive: {
    id: string
    title: string
    description: string
    createdAt: string
    updatedAt: string
  }
  links?: Array<{
    type: 'id'
    id: string
  }>
}

export class Archive {
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

  constructor(archive: IArchiveConstructor) {
    this.images = archive.images ?? []
    this.archive = archive.archive
    this.links = archive.links ?? []
  }
}
