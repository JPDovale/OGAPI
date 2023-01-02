import { v4 as uuidV4 } from 'uuid'

export interface IPower {
  id?: string
  title: string
  description: string
}

export class Power {
  id: string
  title: string
  description: string

  constructor(power: IPower) {
    this.id = uuidV4()
    this.title = power.title
    this.description = power.description
  }
}
