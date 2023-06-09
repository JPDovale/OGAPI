import { inject, injectable } from 'tsyringe'

import { IPersonalitiesRepository } from '@modules/persons/infra/repositories/contracts/IPersonalitiesRepository'
import { type IPersonality } from '@modules/persons/infra/repositories/entities/IPersonality'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  projectId: string
}

interface IResponse {
  personalities: IPersonality[]
}

@injectable()
export class GetPersonalitiesUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonalitiesRepository)
    private readonly personalitiesRepository: IPersonalitiesRepository,

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
    const personalities = await this.personalitiesRepository.listPerPersons(
      personIds,
    )

    return {
      ok: true,
      data: {
        personalities,
      },
    }
  }
}
