import { type ICreateTimeEventDTO } from '@modules/timelines/dtos/ICreateTimeEventDTO'

import { type ITimeEvent } from '../entities/ITimeEvent'
import { type IIUpdateTimeEvent } from '../types/IUpdateTimeEvent'

export abstract class ITimeEventsRepository {
  abstract create(data: ICreateTimeEventDTO): Promise<ITimeEvent | null>
  abstract update(data: IIUpdateTimeEvent): Promise<ITimeEvent | null>
  abstract delete(timeEventId: string): Promise<void>
}
