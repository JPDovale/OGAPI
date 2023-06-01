import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'

import { type IAuthorResponse } from './IAuthorResponse'
import { type ICapitulePreviewResponse } from './ICapitulePreviewResponse'

export interface IBookResponse {
  id: string
  name: {
    title: string
    subtitle: string | null
    fullName: string
  }
  infos: {
    words: number
    writtenWords: number
    literaryGenre: string
    isbn: string
    projectId: string
    createdAt: Date
    updatedAt: Date
  }
  plot: {
    onePhrase: string | null
    premise: string | null
    storyteller: string | null
    ambient: string | null
    countTime: string | null
    historicalFact: string | null
    details: string | null
    summary: string | null
    urlText: string | null
    structure: {
      act1: string | null
      act2: string | null
      act3: string | null
    }
  }
  frontCover: {
    url: string | undefined
    alt: string
  }
  collections: {
    genre: {
      itensLength: number
      itens: Array<{ name: string; id: string }>
    }
    author: {
      itensLength: number
      itens: IAuthorResponse[]
    }
    capitules: {
      itensLength: number
      itens: ICapitulePreviewResponse[]
    }
    comments: {
      itensLength: number
      itens: IComment[]
    }
  }
}
