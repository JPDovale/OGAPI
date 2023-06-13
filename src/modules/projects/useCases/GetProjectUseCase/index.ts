import { inject, injectable } from 'tsyringe'

import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type IClientProject } from '@modules/projects/infra/repositories/entities/IProject'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectNotFound } from '@shared/errors/projects/makeErrorProjectNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'
import { getFeatures } from '@utils/application/dataTransformers/projects/features'

interface IRequest {
  userId: string
  projectId: string
}

interface IResponse {
  project: IClientProject
}

@injectable()
export class GetProjectUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,
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

    const projectReceived = await this.projectsRepository.findById(projectId)
    if (!projectReceived) {
      return {
        ok: false,
        error: makeErrorProjectNotFound(),
      }
    }

    const project: IClientProject = {
      ...projectReceived,
      features: getFeatures(projectReceived.features_using),
    }

    return {
      ok: true,
      data: {
        project,
      },
    }
  }
}
