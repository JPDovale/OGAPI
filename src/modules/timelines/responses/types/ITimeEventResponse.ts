import { type IScene } from '@modules/books/infra/repositories/entities/IScene'
import { type ITimeEventBorn } from '@modules/persons/infra/repositories/entities/IPerson'

export interface ITimeEventResponse {
  id: string
  title: string
  description: string
  happened: {
    timestamp: number
    year: string
    month: string
    day: number
    hour: number
    minute: number
    second: number
    timeChrist: 'A.C.' | 'D.C.'
    fullDate: string
  }
  infos: {
    importance: number
    createdAt: Date
    updatedAt: Date
  }
  collections: {
    person: {
      itensLength: number
      itens: Array<{
        id: string
      }>
    }
    scene: IScene | null
    timeEventBorn: ITimeEventBorn | null
    timeEventToDo: {
      id: number
      completed_at: Date | null
    } | null
  }
}
