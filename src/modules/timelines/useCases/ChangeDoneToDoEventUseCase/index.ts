import { inject, injectable } from 'tsyringe'

import { ITimeEventsRepository } from '@modules/timelines/infra/repositories/contracts/ITimeEventsRepository'
import { ITimeLinesRepository } from '@modules/timelines/infra/repositories/contracts/ITimeLinesRepository'
import { type ITimeEvent } from '@modules/timelines/infra/repositories/entities/ITimeEvent'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorTimeEventNotUpdated } from '@shared/errors/timelines/makeErrorTimeEventNotUpdated'
import { makeErrorTimeLineNotFound } from '@shared/errors/timelines/makeErrorTimeLineNotFound'

interface IRequest {
  userId: string
  projectId: string
  timeLineId: string
  timeEventId: string
}

interface IResponse {
  timeEvent: ITimeEvent
}

@injectable()
export class ChangeDoneToDoEventUseCase {
  constructor(
    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.TimeLinesRepository)
    private readonly timeLinesRepository: ITimeLinesRepository,

    @inject(InjectableDependencies.Repositories.TimeEventsRepository)
    private readonly timeEventsRepositor: ITimeEventsRepository,
  ) {}

  async execute({
    projectId,
    timeEventId,
    timeLineId,
    userId,
  }: IRequest): Promise<IResponse> {
    await this.verifyPermissions.verify({
      projectId,
      userId,
      verifyPermissionTo: 'edit',
      clearCache: true,
      verifyFeatureInProject: ['timeLines'],
    })

    const timeLine = await this.timeLinesRepository.findById(timeLineId)
    if (!timeLine) throw makeErrorTimeLineNotFound()

    const timeEvent = await this.timeEventsRepositor.update({
      timeEventId,
      data: {
        timeEventToDo: {
          update: {
            completed_at: new Date(),
          },
        },
      },
    })

    if (!timeEvent) throw makeErrorTimeEventNotUpdated()

    return {
      timeEvent,
    }
  }
}
