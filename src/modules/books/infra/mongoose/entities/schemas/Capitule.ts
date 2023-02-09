import { v4 as uuidV4 } from 'uuid'

import { ICapitule } from '../types/ICapitule'
import { IStructurePlotBook } from '../types/IPlotBook'
import { IScene } from '../types/IScene'

export class Capitule {
  id?: string
  name: string
  sequence: string
  objective: string
  complete: boolean
  words?: string
  structure?: IStructurePlotBook
  scenes?: IScene[]
  createdAt: string
  updatedAt: string

  constructor(capitule: ICapitule) {
    this.id = capitule.id || uuidV4()
    this.name = capitule.name
    this.sequence = capitule.sequence
    this.objective = capitule.objective
    this.complete = capitule.complete
    this.words = capitule.words || '0'
    this.structure = capitule.structure
    this.scenes = capitule.scenes || []
    this.createdAt = capitule.createdAt
    this.updatedAt = capitule.updatedAt
  }
}
