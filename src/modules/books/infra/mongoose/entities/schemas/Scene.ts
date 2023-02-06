import { v4 as uuidV4 } from 'uuid'

import { IStructurePlotBook } from '../types/IPlotBook'
import { IScene } from '../types/IScene'

export class Scene {
  id: string
  sequence: string
  objective: string
  complete: boolean
  writtenWords?: string
  structure: IStructurePlotBook

  constructor(capitule: IScene) {
    this.id = capitule.id || uuidV4()
    this.sequence = capitule.sequence
    this.objective = capitule.objective
    this.complete = capitule.complete
    this.writtenWords = capitule.writtenWords
    this.structure = capitule.structure
  }
}
