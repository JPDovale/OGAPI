export interface IUpdatePlotDTO {
  onePhrase?: string
  premise?: string
  storyteller?: string
  literaryGenre?: string
  subgenre?: string
  ambient?: string
  countTime?: string
  historicalFact?: string
  details?: string
  summary?: string
  persons?: string[]
  urlOfText?: string
  structure?: {
    act1?: string
    act2?: string
    act3?: string
  }
}
