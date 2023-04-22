import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUserEssentialInfos } from '@modules/accounts/infra/repositories/entities/IUserEssentialInfos'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type IPreviewProject } from '@modules/projects/responses/IPreviewProject'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { KeysRedis } from '@shared/container/providers/CacheProvider/types/Keys'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  userId: string
}

interface IResponse {
  projects: IPreviewProject[]
}

@injectable()
export class ListProjectsPerUserUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute({ userId }: IRequest): Promise<IResponse> {
    const userEssentialInfos =
      await this.cacheProvider.getInfo<IUserEssentialInfos>(
        KeysRedis.userEssentialInfos + userId,
      )

    if (!userEssentialInfos) {
      const user = await this.usersRepository.findById(userId)
      if (!user) throw makeErrorUserNotFound()

      await this.cacheProvider.setInfo<IUserEssentialInfos>(
        KeysRedis.userEssentialInfos + userId,
        {
          email: user.email,
          id: user.id,
          name: user.name,
          admin: user.admin,
        },
        KeysRedis.userEssentialInfosExpires, // 3 days
      )
    }

    let projectsPreview: IPreviewProject[] = []

    const projectsPreviewInCache = await this.cacheProvider.getInfo<IResponse>(
      KeysRedis.userProjectsPreview + userId,
    )

    if (!projectsPreviewInCache) {
      const projectsThisUser =
        await this.projectsRepository.listProjectsOfOneUser(userId)

      await this.cacheProvider.setInfo<IResponse>(
        KeysRedis.userProjectsPreview + userId,
        { projects: projectsThisUser },
        60 * 60, // 1 hour
      )

      projectsPreview = projectsThisUser
    } else {
      projectsPreview = projectsPreviewInCache.projects
    }

    return {
      projects: projectsPreview,
    }
  }
}
