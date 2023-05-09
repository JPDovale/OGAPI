export interface IUpdatePlotDTO {
  onePhrase?: string | null
  premise?: string | null
  storyteller?: string | null
  literaryGenre?: string | null
  subgenre?: string | null
  ambient?: string | null
  countTime?: string | null
  historicalFact?: string | null
  details?: string | null
  summary?: string | null
  urlOfText?: string | null
  structure?: {
    act1?: string | null
    act2?: string | null
    act3?: string | null
  }
}
