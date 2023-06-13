import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'

import { type IPersonInObject } from './IPersonInObject'
import { type ISubObjectResponse } from './ISubObjectResponse'

export interface IPersonalityResponse {
  id: string
  infos: {
    title: string
    description: string
    createdAt: Date
  }
  collections: {
    referencesIt: {
      itensLength: number
      itens: IPersonInObject[]
    }
    consequence: {
      itensLength: number
      itens: ISubObjectResponse[]
    }
    comment: {
      itensLength: number
      itens: IComment[]
    }
  }
}
