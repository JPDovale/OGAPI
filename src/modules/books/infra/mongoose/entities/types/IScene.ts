import { IStructurePlotBook } from './IPlotBook'

export interface IScene {
  id: string
  sequence: string
  objective: string
  complete: boolean
  writtenWords?: string
  structure: IStructurePlotBook
}
