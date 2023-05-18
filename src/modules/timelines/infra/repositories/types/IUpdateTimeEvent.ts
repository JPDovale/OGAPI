import { type IUpdateTimeEventDTO } from '@modules/timelines/dtos/IUpdateTimeEventDTO'

export interface IIUpdateTimeEvent {
  timeEventId: string
  data: IUpdateTimeEventDTO
}
