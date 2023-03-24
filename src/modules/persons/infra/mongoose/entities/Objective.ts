import { v4 as uuidV4 } from 'uuid'

export interface IObjective {
  id: string
  title: string
  description: string
  objectified: boolean
  avoiders: string[]
  supporting: string[]
}

interface IObjectiveConstructor {
  id?: string
  title?: string
  description?: string
  objectified?: boolean
  avoiders?: string[]
  supporting?: string[]
}

export class Objective {
  id: string
  title: string
  description: string
  objectified: boolean
  avoiders: string[]
  supporting: string[]

  constructor(objective: IObjectiveConstructor) {
    this.id = objective.id ?? uuidV4()
    this.title = objective.title ?? ''
    this.description = objective.description ?? ''
    this.objectified = objective.objectified ?? false
    this.avoiders = objective.avoiders ?? []
    this.supporting = objective.supporting ?? []
  }
}
