import { inject, injectable } from 'tsyringe'

import { ITimeEventsRepository } from '@modules/timelines/infra/repositories/contracts/ITimeEventsRepository'
import { ITimeLinesRepository } from '@modules/timelines/infra/repositories/contracts/ITimeLinesRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorTimeLineNotFound } from '@shared/errors/timelines/makeErrorTimeLineNotFound'
import { makeErrorAccessDenied } from '@shared/errors/useFull/makeErrorAccessDenied'

interface IRequest {
  userId: string
  timeLineId: string
  timeEventId: string
  projectId?: string
}

@injectable()
export class DeleteTimeEventUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.TimeLinesRepository)
    private readonly timeLinesRepository: ITimeLinesRepository,

    @inject(InjectableDependencies.Repositories.TimeEventsRepository)
    private readonly timeEventsRepository: ITimeEventsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({
    projectId = '',
    timeEventId,
    timeLineId,
    userId,
  }: IRequest): Promise<void> {
    const timeLine = await this.timeLinesRepository.findById(timeLineId)
    if (!timeLine) throw makeErrorTimeLineNotFound()

    if (timeLine.type === 'to_do') {
      if (userId !== timeLine.user_id) throw makeErrorAccessDenied()

      await this.timeEventsRepository.delete(timeEventId)
      return
    }

    await this.verifyPermissions.verify({
      projectId,
      userId,
      verifyPermissionTo: 'edit',
      clearCache: true,
      verifyFeatureInProject: ['timeLines'],
    })

    await this.timeEventsRepository.delete(timeEventId)
  }
}
