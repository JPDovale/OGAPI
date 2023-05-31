import { inject, injectable } from 'tsyringe'

import { IPowersRepository } from '@modules/persons/infra/repositories/contracts/IPowersRepository'
import { type IPower } from '@modules/persons/infra/repositories/entities/IPower'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  projectId: string
  userId: string
}

interface IResponse {
  powers: IPower[]
}

@injectable()
export class GetPowersUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PowersRepository)
    private readonly powersRepository: IPowersRepository,

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
    const powers = await this.powersRepository.listPerPersons(personIds)

    return {
      ok: true,
      data: {
        powers,
      },
    }
  }
}
