import { v4 as uuidV4 } from 'uuid'

interface IConsequence {
  title?: string
  description?: string
}

export interface IPersonality {
  id?: string
  title: string
  description: string
  consequences: IConsequence[]
}

export class Personality {
  id: string
  title: string
  description: string
  consequences: IConsequence[]

  constructor(personality: IPersonality) {
    this.id = uuidV4()
    this.title = personality.title
    this.description = personality.description
    this.consequences = personality.consequences
  }
}
