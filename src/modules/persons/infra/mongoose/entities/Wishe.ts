import { v4 as uuidV4 } from 'uuid'

export interface IWishe {
  id: string
  title: string
  description: string
}

interface IWisheConstructor {
  id?: string
  title?: string
  description?: string
}
export class Wishe {
  id: string
  title: string
  description: string

  constructor(wishe: IWisheConstructor) {
    this.id = wishe.id ?? uuidV4()
    this.title = wishe.title ?? ''
    this.description = wishe.description ?? ''
  }
}
