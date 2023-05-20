import { type ICreateTimeLineDTO } from '@modules/timelines/dtos/ICreateTimeLineDTO'

import { type ITimeLine } from '../entities/ITimeLine'

export abstract class ITimeLinesRepository {
  abstract findMainOfProject(projectID: string): Promise<ITimeLine | null>
  abstract findById(timeLineId: string): Promise<ITimeLine | null>
  abstract create(data: ICreateTimeLineDTO): Promise<ITimeLine | null>
  abstract deletePerProjectId(projectId: string): Promise<void>
  abstract findToDosPerUserId(userId: string): Promise<ITimeLine[]>
}
