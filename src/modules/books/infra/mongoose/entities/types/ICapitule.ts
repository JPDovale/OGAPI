import { IStructurePlotBook } from './IPlotBook'

export interface ICapitule {
  id?: string
  name: string
  sequence: string
  objective: string
  complete: boolean
  words?: string
  structure?: IStructurePlotBook
  scenes?: string[]
  createdAt?: string
  updatedAt?: string
}
