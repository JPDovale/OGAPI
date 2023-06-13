import { inject, injectable } from 'tsyringe'

import { IDreamsRepository } from '@modules/persons/infra/repositories/contracts/IDreamsRepository'
import { type IDream } from '@modules/persons/infra/repositories/entities/IDream'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  projectId: string
  userId: string
}

interface IResponse {
  dreams: IDream[]
}

@injectable()
export class GetDreamsUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.DreamsRepository)
    private readonly dreamsRepository: IDreamsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute({ projectId, userId }: IRequest): Promise<IResolve<IResponse>> {
    const verification = await this.verifyPermissions.verify({
      projectId,
      userId,
      verifyPermissionTo: 'view',
    })

    if (verification.error) {
      return {
        ok: false,
        error: verification.error,
      }
    }

    const personIds = await this.projectsRepository.listPersonsIds(projectId)
    const dreams = await this.dreamsRepository.listPerPersons(personIds)

    return {
      ok: true,
      data: {
        dreams,
      },
    }
  }
}
