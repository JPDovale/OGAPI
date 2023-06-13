import { type ITimeEventResponse } from './ITimeEventResponse'

export interface ITimeLineResponse {
  id: string
  title: string | null
  description: string | null
  infos: {
    isAlternative: boolean
    createAt: Date
    type: string
  }
  dates: {
    startDate: Date
    endDate: Date
  } | null
  collections: {
    timeEvent: {
      itensLength: number
      itens: ITimeEventResponse[]
    }
  }
}
