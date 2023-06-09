import { inject, injectable } from 'tsyringe'

import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type IFeaturesProjectUses } from '@modules/projects/infra/repositories/entities/IProject'
import { ITimeLinesRepository } from '@modules/timelines/infra/repositories/contracts/ITimeLinesRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectNotUpdate } from '@shared/errors/projects/makeErrorProjectNotUpdate'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'
import {
  getFeatures,
  getListFeaturesInLine,
} from '@utils/application/dataTransformers/projects/features'

interface IRequest {
  userId: string
  projectId: string
  features: IFeaturesProjectUses
}

interface IResponse {
  features: IFeaturesProjectUses
}

@injectable()
export class ChangeFeaturesUsingUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.TimeLinesRepository)
    private readonly timeLinesRepository: ITimeLinesRepository,

    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Repositories.BooksRepository)
    private readonly booksRepository: IBooksRepository,
  ) {}

  async execute({
    userId,
    projectId,
    features,
  }: IRequest): Promise<IResolve<IResponse>> {
    const verification = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    if (verification.error) {
      return {
        ok: false,
        error: verification.error,
      }
    }

    const newListFeatures = getListFeaturesInLine(features)

    const projectUpdate = await this.projectsRepository.update({
      projectId,
      data: {
        features_using: newListFeatures,
      },
    })

    if (!projectUpdate) {
      return {
        ok: false,
        error: makeErrorProjectNotUpdate(),
      }
    }

    const newFeatures = getFeatures(projectUpdate.features_using)
    const promises: Array<Promise<void> | false> = [
      !newFeatures.timeLines &&
        this.timeLinesRepository.deletePerProjectId(projectId),

      !newFeatures.books && this.booksRepository.deletePerProjectId(projectId),

      !newFeatures.persons &&
        this.personsRepository.deletePerProjectId(projectId),
    ]

    await Promise.all(promises)

    return {
      ok: true,
      data: {
        features: newFeatures,
      },
    }
  }
}
