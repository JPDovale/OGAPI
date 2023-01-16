import { container } from 'tsyringe'

import { DayJsDateProvider } from '@shared/container/provides/DateProvider/implementations/DayJsDateProvider'

const dateProvider = container.resolve(DayJsDateProvider)

export interface IAvatar {
  fileName: string
  url: string
  createdAt?: string
  updatedAt?: string
}

export class Avatar {
  fileName: string
  url: string
  createdAt: string
  updatedAt: string

  constructor(newImage: IAvatar) {
    this.fileName = newImage.fileName
    this.url = newImage.url
    this.createdAt = dateProvider.getDate(new Date())
    this.updatedAt = dateProvider.getDate(new Date())
  }
}
