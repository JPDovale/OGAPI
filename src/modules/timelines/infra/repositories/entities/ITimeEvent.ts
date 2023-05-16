import { type IScene } from '@modules/books/infra/repositories/entities/IScene'
import { type IPerson } from '@modules/persons/infra/repositories/entities/IPerson'
import { type TimeEvent } from '@prisma/client'

export interface ITimeEvent extends TimeEvent {
  persons?: Array<Partial<IPerson>>
  scenes?: Array<Partial<IScene>>
}
