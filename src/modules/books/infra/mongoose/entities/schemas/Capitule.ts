import { v4 as uuidV4 } from 'uuid'

import { type IStructurePlotBook } from '../types/IPlotBook'
import { type IScene } from '../types/IScene'

interface ICapituleConstructor {
  id?: string
  name: string
  sequence: string
  objective: string
  complete: boolean
  words?: string
  structure: IStructurePlotBook
  scenes?: IScene[]
  createdAt: string
  updatedAt: string
}
export class Capitule {
  id: string
  name: string
  sequence: string
  objective: string
  complete: boolean
  words: string
  structure: IStructurePlotBook
  scenes: IScene[]
  createdAt: string
  updatedAt: string

  constructor(capitule: ICapituleConstructor) {
    this.id = capitule.id ?? uuidV4()
    this.name = capitule.name
    this.sequence = capitule.sequence
    this.objective = capitule.objective
    this.complete = capitule.complete
    this.words = capitule.words ?? '0'
    this.structure = capitule.structure ?? { act1: '', act2: '', act3: '' }
    this.scenes = capitule.scenes ?? []
    this.createdAt = capitule.createdAt
    this.updatedAt = capitule.updatedAt
  }
}
