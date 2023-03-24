import { type IStructurePlotBook } from './IPlotBook'
import { type IScene } from './IScene'

export interface ICapitule {
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
}
