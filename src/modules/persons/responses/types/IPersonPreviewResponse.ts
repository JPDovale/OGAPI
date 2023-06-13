export interface IPersonPreviewResponse {
  id: string
  name: {
    first: string
    last: string
    full: string
  }
  age: {
    number: number
    bornDateTimestamp: number
    bornDate: string
  }
  image: {
    url: string | undefined
    alt: string
  }
  history: string
  infos: {
    createdAt: Date
    updatedAt: Date
  }
  collections: {
    objective: {
      itensLength: number
    }
    dream: {
      itensLength: number
    }
    fear: {
      itensLength: number
    }
    couple: {
      itensLength: number
    }
    appearance: {
      itensLength: number
    }
    personality: {
      itensLength: number
    }
    power: {
      itensLength: number
    }
    trauma: {
      itensLength: number
    }
    value: {
      itensLength: number
    }
    wishe: {
      itensLength: number
    }
  }
}
