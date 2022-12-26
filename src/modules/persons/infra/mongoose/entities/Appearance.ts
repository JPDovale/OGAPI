import { v4 as uuidV4 } from 'uuid'

interface ICharacter {
  title: string
  description: string
}

export class Character {
  id: string
  title: string
  description: string

  constructor(character: ICharacter) {
    this.id = uuidV4()
    this.title = character.title
    this.description = character.description
  }
}

export interface IAppearance {
  character?: ICharacter[]
  images?: string[]
}

export class Appearance {
  character: ICharacter[]
  images: string[]

  constructor(appearance: IAppearance) {
    this.character = appearance.character || []
    this.images = appearance.images || []
  }
}
