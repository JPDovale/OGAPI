import { type IScene } from '@modules/books/infra/repositories/entities/IScene'
import {
  type ITimeEventBorn,
  type IPerson,
} from '@modules/persons/infra/repositories/entities/IPerson'
import { type TimeEvent } from '@prisma/client'

export interface ITimeEvent extends TimeEvent {
  timeEventToDo: {
    id: number
    completed_at: Date | null
  } | null
  timeEventBorn: ITimeEventBorn | null
  persons?: Array<Partial<IPerson>>
  scene?: IScene | null
}
