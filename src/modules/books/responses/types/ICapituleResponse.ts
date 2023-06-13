import { type ISceneResponse } from './ISceneResponse'

export interface ICapituleResponse {
  id: string
  name: string
  infos: {
    complete: boolean
    sequence: number
    words: number
    objective: string
    projectId: string
    bookId: string
  }
  structure: {
    act1: string | null
    act2: string | null
    act3: string | null
  }
  collections: {
    scene: {
      itensLength: number
      itens: ISceneResponse[]
    }
  }
}
