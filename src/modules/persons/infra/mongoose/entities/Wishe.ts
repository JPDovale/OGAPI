import { v4 as uuidV4 } from 'uuid'

export interface IWishe {
  id?: string
  title: string
  description: string
}

export class Wishe {
  id: string
  title: string
  description: string

  constructor(wishe: IWishe) {
    this.id = uuidV4()
    this.title = wishe.title
    this.description = wishe.description
  }
}
