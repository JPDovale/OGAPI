import { inject, injectable } from 'tsyringe'

import { IFearsRepository } from '@modules/persons/infra/repositories/contracts/IFearsRepository'
import { type IFear } from '@modules/persons/infra/repositories/entities/IFear'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  projectId: string
  userId: string
}

interface IResponse {
  fears: IFear[]
}

@injectable()
export class GetFearsUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.FearsRepository)
    private readonly fearsRepository: IFearsRepository,

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
    const fears = await this.fearsRepository.listPerPersons(personIds)

    return {
      ok: true,
      data: {
        fears,
      },
    }
  }
}
