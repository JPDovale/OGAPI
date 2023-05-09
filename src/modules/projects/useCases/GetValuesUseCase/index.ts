import { inject, injectable } from 'tsyringe'

import { IValuesRepository } from '@modules/persons/infra/repositories/contracts/IValuesRepository'
import { type IValue } from '@modules/persons/infra/repositories/entities/IValue'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'

interface IRequest {
  projectId: string
  userId: string
}

interface IResponse {
  values: IValue[]
}

@injectable()
export class GetValuesUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.ValuesRepository)
    private readonly valuesRepository: IValuesRepository,

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
    const values = await this.valuesRepository.listPerPersons(personIds)

    return {
      values,
    }
  }
}
