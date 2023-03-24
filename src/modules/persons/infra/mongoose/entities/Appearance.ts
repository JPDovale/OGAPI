import { v4 as uuidV4 } from 'uuid'

export interface IAppearance {
  id: string
  title: string
  description: string
}

interface IAppearanceConstructor {
  id?: string
  title?: string
  description?: string
}
export class Appearance {
  id: string
  title: string
  description: string

  constructor(appearance: IAppearanceConstructor) {
    this.id = appearance.id ?? uuidV4()
    this.title = appearance.title ?? ''
    this.description = appearance.description ?? ''
  }
}
