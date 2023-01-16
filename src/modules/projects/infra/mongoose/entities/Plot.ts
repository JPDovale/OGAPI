import { IComment } from './Comment'

interface IStructure {
  act1?: string
  act2?: string
  act3?: string
}

export interface IPlotProject {
  onePhrase?: string
  premise?: string
  storyteller?: string
  literaryGenere?: string
  subgenre?: string
  ambient?: string
  countTime?: string
  historicalFact?: string
  details?: string
  summary?: string
  persons?: string[]
  structure?: IStructure
  comments?: IComment[]
}

export class PlotProject {
  onePhrase: string
  premise: string
  storyteller: string
  literaryGenere: string
  subgenre: string
  ambient: string
  countTime: string
  historicalFact: string
  details: string
  summary: string
  persons: string[]
  structure: IStructure
  comments: IComment[]

  constructor(plot: IPlotProject) {
    this.onePhrase = plot.onePhrase || ''
    this.premise = plot.premise || ''
    this.storyteller = plot.storyteller || ''
    this.literaryGenere = plot.literaryGenere || ''
    this.subgenre = plot.subgenre || ''
    this.ambient = plot.ambient || ''
    this.countTime = plot.countTime || ''
    this.historicalFact = plot.historicalFact || ''
    this.details = plot.details || ''
    this.summary = plot.summary || ''
    this.persons = plot.persons || []
    this.structure = plot.structure || {}
    this.comments = plot.comments || []
  }
}
