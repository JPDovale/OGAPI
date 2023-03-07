import { IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'

import { IArchive } from '../types/IArchive'

export class Archive {
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

  constructor(archive: IArchive) {
    this.images = archive.images || []
    this.archive = archive.archive
    this.links = this.links || []
  }
}
