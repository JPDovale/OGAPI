import { type IAppearanceResponse } from './IAppearanceResponse'
import { type ICoupleResponse } from './ICoupleResponse'
import { type IDreamResponse } from './IDreamResponse'
import { type IFearResponse } from './IFearResponse'
import { type IObjectiveResponse } from './IObjectiveResponse'
import { type IPersonalityResponse } from './IPersonalityResponse'
import { type IPowerResponse } from './IPowerResponse'
import { type ITraumaResponse } from './ITraumaResponse'
import { type IValueResponse } from './IValueResponse'
import { type IWisheResponse } from './IWisheResponse'

export interface IPersonResponse {
  id: string
  name: {
    first: string
    last: string
    full: string
  }
  age: {
    number: number | null
    bornDateTimestamp: number
    bornDate: string
    bornDateYear: string
    bornDateMonth: string
    bornDateDay: number
    bornDateHour: number
    bornDateMinute: number
    bornDateSecond: number
    bornTimeChrist: 'A.C.' | 'D.C.'
  }
  image: {
    url: string | undefined
    alt: string
  }
  history: string
  infos: {
    createdAt: Date
    updatedAt: Date
    projectId: string
  }
  collections: {
    objective: {
      itensLength: number
      itens: IObjectiveResponse[]
    }
    dream: {
      itensLength: number
      itens: IDreamResponse[]
    }
    fear: {
      itensLength: number
      itens: IFearResponse[]
    }
    couple: {
      itensLength: number
      itens: ICoupleResponse[]
    }
    appearance: {
      itensLength: number
      itens: IAppearanceResponse[]
    }
    personality: {
      itensLength: number
      itens: IPersonalityResponse[]
    }
    power: {
      itensLength: number
      itens: IPowerResponse[]
    }
    trauma: {
      itensLength: number
      itens: ITraumaResponse[]
    }
    value: {
      itensLength: number
      itens: IValueResponse[]
    }
    wishe: {
      itensLength: number
      itens: IWisheResponse[]
    }
  }
}
