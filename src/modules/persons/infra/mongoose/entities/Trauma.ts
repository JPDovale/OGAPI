import { v4 as uuidV4 } from 'uuid'

interface IConsequence {
  title: string
  description: string
}

export interface ITrauma {
  id: string
  title: string
  description: string
  consequences: IConsequence[]
}

interface ITraumaConstructor {
  id?: string
  title?: string
  description?: string
  consequences?: IConsequence[]
}

export class Trauma {
  id: string
  title: string
  description: string
  consequences: IConsequence[]

  constructor(trauma: ITraumaConstructor) {
    this.id = trauma.id ?? uuidV4()
    this.title = trauma.title ?? ''
    this.description = trauma.description ?? ''
    this.consequences = trauma.consequences ?? []
  }
}
