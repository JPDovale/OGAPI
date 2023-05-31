export interface IBookPreviewResponse {
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
    isbn: string | null
    createdAt: Date
    updatedAt: Date
  }
  frontCover: {
    url: string | undefined
    alt: string
  }
  collections: {
    genre: {
      itensLength: number
    }
    author: {
      itensLength: number
    }
    capitules: {
      itensLength: number
    }
    comments: {
      itensLength: number
    }
  }
}
