import { type ICreateTimeEventDTO } from '@modules/timelines/dtos/ICreateTimeEventDTO'

import { type ITimeEvent } from '../entities/ITimeEvent'

export abstract class ITimeEventsRepository {
  abstract create(data: ICreateTimeEventDTO): Promise<ITimeEvent | null>
}
