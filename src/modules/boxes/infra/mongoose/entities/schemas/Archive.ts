import { randomUUID } from 'node:crypto'
import { container } from 'tsyringe'

import { type IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider'

const dateProvider = container.resolve(DayJsDateProvider)

interface IArchiveConstructor {
  images?: IAvatar[]
  archive: {
    id?: string
    title: string
    description: string
    createdAt?: string
    updatedAt?: string
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
    this.archive = {
      id: archive.archive.id ?? randomUUID(),
      title: archive.archive.title,
      description: archive.archive.description,
      createdAt: archive.archive.createdAt ?? dateProvider.getDate(new Date()),
      updatedAt: archive.archive.updatedAt ?? dateProvider.getDate(new Date()),
    }
    this.links = archive.links ?? []
  }
}
