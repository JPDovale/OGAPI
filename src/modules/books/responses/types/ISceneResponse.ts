import { type IPersonInObject } from '@modules/persons/responses/types/IPersonInObject'

export interface ISceneResponse {
  id: string
  infos: {
    complete: boolean
    sequence: number
    writtenWords: number
    objective: string
  }
  structure: {
    act1: string
    act2: string
    act3: string
  }
  happened: {
    timestamp: number
    year: string
    month: string
    day: number
    hour: number
    minute: number
    second: number
    timeChrist: 'A.C.' | 'D.C.'
    fullDate: string
  }
  collections: {
    persons: {
      itensLength: number
      itens: IPersonInObject[]
    }
  }
}
