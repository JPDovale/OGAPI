import { inject, injectable } from 'tsyringe'

import { ITraumasRepository } from '@modules/persons/infra/repositories/contracts/ITraumasRepository'
import { type ITrauma } from '@modules/persons/infra/repositories/entities/ITrauma'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'

interface IRequest {
  userId: string
  projectId: string
}

interface IResponse {
  traumas: ITrauma[]
}

@injectable()
export class GetTraumasUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.TraumasRepository)
    private readonly traumasRepository: ITraumasRepository,

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
    const traumas = await this.traumasRepository.listPerPersons(personIds)

    return {
      traumas,
    }
  }
}
