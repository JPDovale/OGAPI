export interface ICapitulePreviewResponse {
  id: string
  name: string
  infos: {
    complete: boolean
    sequence: number
    words: number
    objective: string
  }
  structure: {
    act1: string | null
    act2: string | null
    act3: string | null
  }
  collections: {
    scene: {
      itensLength: number
    }
  }
}
