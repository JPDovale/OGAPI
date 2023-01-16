import { v4 as uuidV4 } from 'uuid'

export interface ICouple {
  id?: string
  personId: string
  title: string
  description: string
  final: boolean
}

export class Couple {
  id: string
  personId: string
  title: string
  description: string
  final: boolean

  constructor(couple: ICouple) {
    this.id = uuidV4()
    this.personId = couple.personId
    this.title = couple.title
    this.description = couple.description
    this.final = couple.final
  }
}
