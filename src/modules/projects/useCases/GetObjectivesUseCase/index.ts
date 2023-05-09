import { inject, injectable } from 'tsyringe'

import { IObjectivesRepository } from '@modules/persons/infra/repositories/contracts/IObjectivesRepository'
import { type IObjective } from '@modules/persons/infra/repositories/entities/IObjective'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'

interface IRequest {
  userId: string
  projectId: string
}

interface IResponse {
  objectives: IObjective[]
}

@injectable()
export class GetObjectivesUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.ObjectivesRepository)
    private readonly objectiveRepository: IObjectivesRepository,

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
    const objectives = await this.objectiveRepository.listPerPersons(personIds)

    return {
      objectives,
    }
  }
}
