import { v4 as uuidV4 } from 'uuid'

export interface IAppearance {
  id?: string
  title: string
  description: string
}

export class Appearance {
  id: string
  title: string
  description: string

  constructor(newAppearance: IAppearance) {
    this.id = uuidV4()
    this.title = newAppearance.title
    this.description = newAppearance.description
  }
}
