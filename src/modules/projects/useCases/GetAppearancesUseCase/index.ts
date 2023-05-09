import { inject, injectable } from 'tsyringe'

import { IAppearancesRepository } from '@modules/persons/infra/repositories/contracts/IAppearancesRepository'
import { type IAppearance } from '@modules/persons/infra/repositories/entities/IAppearance'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'

interface IRequest {
  userId: string
  projectId: string
}

interface IResponse {
  appearances: IAppearance[]
}

@injectable()
export class GetAppearancesUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.AppearancesRepository)
    private readonly appearancesRepository: IAppearancesRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute({ projectId, userId }: IRequest): Promise<IResponse> {
    await this.verifyPermissions.verify({
      projectId,
      userId,
      verifyPermissionTo: 'view',
    })

    const personIds = await this.projectsRepository.listPersonsIds(projectId)
    const appearances = await this.appearancesRepository.listPerPersons(
      personIds,
    )

    return {
      appearances,
    }
  }
}
