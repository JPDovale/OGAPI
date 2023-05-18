import { type IFeaturesProjectUses } from '@modules/projects/infra/repositories/entities/IProject'

export interface ICreatorProjectResponse {
  id: string
  avatar: {
    alt: string
    url: string | undefined
  }
  email: string
  name: string
  username: string
}

export interface IProjectResponse {
  id: string
  name: string
  private: boolean
  password: string | null
  type: 'book' | 'rpg' | 'roadMap' | 'gameplay'
  createdAt: Date
  updatedAt: Date
  features: IFeaturesProjectUses
  creator: ICreatorProjectResponse
  initialDate: {
    timestamp: number
    fullDate: string
    timeChrist: 'A.C.' | 'D.C.'
    year: string
  }
  image: {
    alt: string
    url: string | undefined
  }
  plot?: {
    onePhrase: string | null
    premise: string | null
    storyteller: string | null
    literaryGenre: string | null
    subgenre: string | null
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
  collections: {
    book: {
      itensLength: number
    }
    person: {
      itensLength: number
    }
    timeLine: {
      itensLength: number
    }
  }
}
