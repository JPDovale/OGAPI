import { type TimeLine } from '@prisma/client'

import { type ITimeEvent } from './ITimeEvent'

export interface ITimeLine extends TimeLine {
  timeEvents?: ITimeEvent[]
  _count?: {
    timeEvents?: number
  }
}
