import { inject, injectable } from 'tsyringe'

import { ITimeLinesRepository } from '@modules/timelines/infra/repositories/contracts/ITimeLinesRepository'
import { type ITimeLine } from '@modules/timelines/infra/repositories/entities/ITimeLine'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorTimeLineNotCreated } from '@shared/errors/timelines/makeErrorTimeLineNotCreated'

interface IRequest {
  userId: string
  projectId: string
  title: string
  description: string
}

interface IResponse {
  timeLine: ITimeLine
}

@injectable()
export class CreateAlternativeTimeLineUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.TimeEventsRepository)
    private readonly timeLinesRepository: ITimeLinesRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({
    description,
    projectId,
    title,
    userId,
  }: IRequest): Promise<IResponse> {
    const { project } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
      clearCache: true,
      verifyFeatureInProject: ['timeLines'],
    })

    const timeLine = await this.timeLinesRepository.create({
      project_id: projectId,
      user_id: userId,
      description,
      title,
    })

    if (!timeLine) throw makeErrorTimeLineNotCreated()

    return {
      timeLine,
    }
  }
}
