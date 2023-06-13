import { inject, injectable } from 'tsyringe'

import { IWishesRepository } from '@modules/persons/infra/repositories/contracts/IWishesRepository'
import { type IWishe } from '@modules/persons/infra/repositories/entities/IWishe'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  projectId: string
  userId: string
}

interface IResponse {
  wishes: IWishe[]
}

@injectable()
export class GetWishesUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.WishesRepository)
    private readonly wishesRepository: IWishesRepository,

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
    const wishes = await this.wishesRepository.listPerPersons(personIds)

    return {
      ok: true,
      data: {
        wishes,
      },
    }
  }
}
