interface IPlotBookConstructor {
  onePhrase?: string
  premise?: string
  storyteller?: string
  ambient?: string
  countTime?: string
  historicalFact?: string
  details?: string
  summary?: string
  persons?: string[]
  structure?: {
    act1?: string
    act2?: string
    act3?: string
  }
  urlOfText?: string
}

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
  structure: {
    act1: string
    act2: string
    act3: string
  }

  urlOfText: string

  constructor(plot: IPlotBookConstructor) {
    this.onePhrase = plot.onePhrase ?? ''
    this.premise = plot.premise ?? ''
    this.storyteller = plot.storyteller ?? ''
    this.ambient = plot.ambient ?? ''
    this.countTime = plot.countTime ?? ''
    this.historicalFact = plot.historicalFact ?? ''
    this.details = plot.details ?? ''
    this.summary = plot.summary ?? ''
    this.persons = plot.persons ?? []
    this.structure = plot.structure
      ? {
          act1: plot.structure.act1 ?? '',
          act2: plot.structure.act2 ?? '',
          act3: plot.structure.act3 ?? '',
        }
      : {
          act1: '',
          act2: '',
          act3: '',
        }
    this.urlOfText = plot.urlOfText ?? ''
  }
}
