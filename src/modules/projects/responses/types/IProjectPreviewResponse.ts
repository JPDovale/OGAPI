import { type IFeaturesProjectUses } from '@modules/projects/infra/repositories/entities/IProject'

export interface ICreator {
  avatar: {
    url: string | undefined
    alt: string
  }
  name: string
  username: string
  email: string
  id: string
}

export interface IUserInProject {
  permission: 'edit' | 'view' | 'comment'
  avatar: {
    url: string | undefined
    alt: string
  }
  id: string
}

export interface IProjectPreviewResponse {
  id: string
  image: {
    alt: string
    url: string | undefined
  }
  initialDate: {
    year: string
  }
  name: string
  type: string
  createdAt: Date
  features: IFeaturesProjectUses
  creator: ICreator
  users: IUserInProject[]
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
