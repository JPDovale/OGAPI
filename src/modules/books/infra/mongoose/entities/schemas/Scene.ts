import { v4 as uuidV4 } from 'uuid'

import { type IStructurePlotBook } from '../types/IPlotBook'

interface ISceneConstructor {
  id?: string
  sequence: string
  objective: string
  complete: boolean
  writtenWords?: string
  structure: IStructurePlotBook
  persons: string[]
}

export class Scene {
  id: string
  sequence: string
  objective: string
  complete: boolean
  writtenWords: string
  structure: IStructurePlotBook
  persons: string[]

  constructor(scene: ISceneConstructor) {
    this.id = scene.id ?? uuidV4()
    this.sequence = scene.sequence
    this.objective = scene.objective
    this.complete = scene.complete
    this.writtenWords = scene.writtenWords ?? '0'
    this.structure = scene.structure
    this.persons = scene.persons
  }
}
