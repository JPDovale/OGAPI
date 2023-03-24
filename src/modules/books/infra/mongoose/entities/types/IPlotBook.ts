export interface IStructurePlotBook {
  act1: string
  act2: string
  act3: string
}

export interface IPlotBook {
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
  urlOfText: string
}
