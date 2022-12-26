export interface IUpdatePlotDTO {
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
  structure?: {
    act1?: string
    act2?: string
    act3?: string
  }
}
