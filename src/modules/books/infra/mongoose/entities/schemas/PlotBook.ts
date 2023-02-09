import { IPlotBook, IStructurePlotBook } from '../types/IPlotBook'

export class PlotBook {
  onePhrase: string
  premise: string
  storyteller: string
  ambient: string
  countTime: string
  historicalFact: string
  details: string
  summary: string
  persons: string[]
  structure: IStructurePlotBook
  urlOfText?: string

  constructor(plot: IPlotBook) {
    this.onePhrase = plot.onePhrase || ''
    this.premise = plot.premise || ''
    this.storyteller = plot.storyteller || ''
    this.ambient = plot.ambient || ''
    this.countTime = plot.countTime || ''
    this.historicalFact = plot.historicalFact || ''
    this.details = plot.details || ''
    this.summary = plot.summary || ''
    this.persons = plot.persons || []
    this.structure = plot.structure || {}
    this.urlOfText = plot.urlOfText || ''
  }
}
