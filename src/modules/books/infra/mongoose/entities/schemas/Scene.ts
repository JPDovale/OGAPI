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
  persons: string[]

  constructor(scene: IScene) {
    this.id = scene.id || uuidV4()
    this.sequence = scene.sequence
    this.objective = scene.objective
    this.complete = scene.complete
    this.writtenWords = scene.writtenWords
    this.structure = scene.structure
    this.persons = scene.persons
  }
}
