import { inject, injectable } from 'tsyringe'

import { ITimeEventsRepository } from '@modules/timelines/infra/repositories/contracts/ITimeEventsRepository'
import { ITimeLinesRepository } from '@modules/timelines/infra/repositories/contracts/ITimeLinesRepository'
import { type ITimeEvent } from '@modules/timelines/infra/repositories/entities/ITimeEvent'
import { type ITimeLine } from '@modules/timelines/infra/repositories/entities/ITimeLine'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorTimeLineNotCreated } from '@shared/errors/timelines/makeErrorTimeLineNotCreated'
import { makeErrorTimeLineNotFound } from '@shared/errors/timelines/makeErrorTimeLineNotFound'

interface IRequest {
  userId: string
  projectId: string
  timeLineId: string
}

interface IResponse {
  timeLine: ITimeLine
}

@injectable()
export class CopyTimeLineToProjectUseCase {
  constructor(
    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissionsService: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.TimeLinesRepository)
    private readonly timeLinesRepositor: ITimeLinesRepository,

    @inject(InjectableDependencies.Repositories.TimeEventsRepository)
    private readonly timeEventsRepositor: ITimeEventsRepository,
  ) {}

  async execute({
    projectId,
    timeLineId,
    userId,
  }: IRequest): Promise<IResponse> {
    const { project } = await this.verifyPermissionsService.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
      verifyFeatureInProject: ['timeLines'],
      clearCache: true,
    })

    const timeLineToCopyOnProject = await this.timeLinesRepositor.findById(
      timeLineId,
    )
    if (!timeLineToCopyOnProject) throw makeErrorTimeLineNotFound()

    const timeLineCopied = await this.timeLinesRepositor.create({
      user_id: project.user_id,
      description: timeLineToCopyOnProject.description,
      end_date: timeLineToCopyOnProject.end_date,
      is_alternative: true,
      project_id: projectId,
      start_date: timeLineToCopyOnProject.start_date,
      title: timeLineToCopyOnProject.title,
      type: timeLineToCopyOnProject.type,
    })
    if (!timeLineCopied) throw makeErrorTimeLineNotCreated()

    const eventsToCreate: Array<Promise<ITimeEvent | null>> = []
    timeLineToCopyOnProject.timeEvents?.map((timeEvent) =>
      eventsToCreate.push(
        this.timeEventsRepositor.create({
          description: timeEvent.description,
          happened_date: timeEvent.happened_date,
          happened_date_timestamp: timeEvent.happened_date_timestamp,
          happened_day: timeEvent.happened_day,
          happened_hour: timeEvent.happened_hour,
          happened_minute: timeEvent.happened_minute,
          happened_month: timeEvent.happened_month,
          happened_second: timeEvent.happened_second,
          happened_year: timeEvent.happened_year,
          happened_year_time_christ: timeEvent.happened_year_time_christ,
          title: timeEvent.title,
          importance: timeEvent.importance,
          time_line_id: timeLineCopied.id,
          TimeEventToDo: {
            create: {},
          },
        }),
      ),
    )

    await Promise.all(eventsToCreate)

    return {
      timeLine: timeLineCopied,
    }
  }
}
