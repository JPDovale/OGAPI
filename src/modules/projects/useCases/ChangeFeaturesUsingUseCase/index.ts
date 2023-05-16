import { inject, injectable } from 'tsyringe'

import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type IFeaturesProjectUses } from '@modules/projects/infra/repositories/entities/IProject'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectNotUpdate } from '@shared/errors/projects/makeErrorProjectNotUpdate'
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
  ) {}

  async execute({ userId, projectId, features }: IRequest): Promise<IResponse> {
    await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    const newListFeatures = getListFeaturesInLine(features)

    const projectUpdate = await this.projectsRepository.update({
      projectId,
      data: {
        features_using: newListFeatures,
      },
    })

    if (!projectUpdate) throw makeErrorProjectNotUpdate()

    const newFeatures = getFeatures(projectUpdate.features_using)

    return {
      features: newFeatures,
    }
  }
}
