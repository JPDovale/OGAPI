import { inject, injectable } from 'tsyringe'

import { ICapitulesRepository } from '@modules/books/infra/repositories/contracts/ICapitulesRepository'
import { type ICapitule } from '@modules/books/infra/repositories/entities/ICapitule'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorCapituleNotFound } from '@shared/errors/books/makeErrorCapituleNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  capituleId: string
}

interface IResponse {
  capitule: ICapitule
}

@injectable()
export class GetCapituleUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.CapitulesRepository)
    private readonly capitulesRepository: ICapitulesRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({
    capituleId,
    userId,
  }: IRequest): Promise<IResolve<IResponse>> {
    const capitule = await this.capitulesRepository.findById(capituleId)
    if (!capitule) {
      return {
        ok: false,
        error: makeErrorCapituleNotFound(),
      }
    }

    const verification = await this.verifyPermissions.verify({
      projectId: capitule.book!.project_id,
      userId,
      verifyPermissionTo: 'edit',
      verifyFeatureInProject: ['books'],
    })

    if (verification.error) {
      return {
        ok: false,
        error: verification.error,
      }
    }

    return {
      ok: true,
      data: {
        capitule,
      },
    }
  }
}
