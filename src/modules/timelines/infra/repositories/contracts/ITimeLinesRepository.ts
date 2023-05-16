import { type ICreateTimeLineDTO } from '@modules/timelines/dtos/ICreateTimeLineDTO'

import { type ITimeLine } from '../entities/ITimeLine'

export abstract class ITimeLinesRepository {
  abstract findMainOfProject(projectID: string): Promise<ITimeLine | null>
  abstract create(data: ICreateTimeLineDTO): Promise<ITimeLine | null>
}
