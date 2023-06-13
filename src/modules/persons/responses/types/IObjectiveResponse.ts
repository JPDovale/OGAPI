import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'

import { type IPersonInObject } from './IPersonInObject'

export interface IObjectiveResponse {
  id: string
  infos: {
    title: string
    description: string
    itBeRealized: boolean
    createdAt: Date
  }
  collections: {
    avoider: {
      itensLength: number
      itens: IPersonInObject[]
    }
    supporter: {
      itensLength: number
      itens: IPersonInObject[]
    }
    referencesIt: {
      itensLength: number
      itens: IPersonInObject[]
    }
    comment: {
      itensLength: number
      itens: IComment[]
    }
  }
}
