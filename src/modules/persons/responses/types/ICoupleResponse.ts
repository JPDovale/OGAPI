import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'

import { type IInCouplePerson } from './IInCouplePerson'

export interface ICoupleResponse {
  id: string
  infos: {
    title: string
    description: string
    createdAt: Date
    untilEnd: boolean
  }
  collections: {
    couple: IInCouplePerson
    comment: {
      itensLength: number
      itens: IComment[]
    }
  }
}
