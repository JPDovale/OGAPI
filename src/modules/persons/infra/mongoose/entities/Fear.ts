import { v4 as uuidV4 } from 'uuid'

export interface IFear {
  id: string
  title: string
  description: string
}

interface IFearConstructor {
  id?: string
  title?: string
  description?: string
}

export class Fear {
  id: string
  title: string
  description: string

  constructor(fear: IFearConstructor) {
    this.id = fear.id ?? uuidV4()
    this.title = fear.title ?? ''
    this.description = fear.description ?? ''
  }
}
