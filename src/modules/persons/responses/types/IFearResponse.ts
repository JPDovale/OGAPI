import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'

import { type IPersonInObject } from './IPersonInObject'

export interface IFearResponse {
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
    comment: {
      itensLength: number
      itens: IComment[]
    }
  }
}
