import { inject, injectable } from 'tsyringe'

import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type IClientProject } from '@modules/projects/infra/repositories/entities/IProject'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectNotFound } from '@shared/errors/projects/makeErrorProjectNotFound'
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

  async execute({ projectId, userId }: IRequest): Promise<IResponse> {
    await this.verifyPermissions.verify({
      projectId,
      userId,
      verifyPermissionTo: 'view',
    })

    const projectReceived = await this.projectsRepository.findById(projectId)
    if (!projectReceived) throw makeErrorProjectNotFound()

    const project: IClientProject = {
      ...projectReceived,
      features: getFeatures(projectReceived.features_using),
    }

    return { project }
  }
}
