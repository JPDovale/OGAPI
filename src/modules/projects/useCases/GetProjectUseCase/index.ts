import { inject, injectable } from 'tsyringe'

import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type IProject } from '@modules/projects/infra/repositories/entities/IProject'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { KeysRedis } from '@shared/container/providers/CacheProvider/types/Keys'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectNotFound } from '@shared/errors/projects/makeErrorProjectNotFound'

interface IRequest {
  userId: string
  projectId: string
}

interface IResponse {
  project: IProject
}

@injectable()
export class GetProjectUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({ projectId, userId }: IRequest): Promise<IResponse> {
    await this.verifyPermissions.verify({
      projectId,
      userId,
      verifyPermissionTo: 'view',
    })

    let Project: IProject | null

    const projectInCache = await this.cacheProvider.getInfo<IResponse>(
      KeysRedis.project + projectId,
    )

    if (!projectInCache) {
      const project = await this.projectsRepository.findById(projectId)
      if (!project) throw makeErrorProjectNotFound()

      await this.cacheProvider.setInfo<IResponse>(
        KeysRedis.project + projectId,
        {
          project,
        },
        60 * 10,
      )

      Project = project
    } else {
      Project = projectInCache.project
    }

    return { project: Project }
  }
}
