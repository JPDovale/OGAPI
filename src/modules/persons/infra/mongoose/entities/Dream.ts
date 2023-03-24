import { v4 as uuidV4 } from 'uuid'

export interface IDream {
  id: string
  title: string
  description: string
}

interface IDreamConstructor {
  id?: string
  title?: string
  description?: string
}

export class Dream {
  id: string
  title: string
  description: string

  constructor(dream: IDreamConstructor) {
    this.id = dream.id ?? uuidV4()
    this.title = dream.title ?? ''
    this.description = dream.description ?? ''
  }
}
