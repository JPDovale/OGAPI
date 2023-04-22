import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { KeysRedis } from '@shared/container/providers/CacheProvider/types/Keys'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectNotCreated } from '@shared/errors/projects/makeErrorProjectNotCreated'
import { makeErrorLimitFreeInEnd } from '@shared/errors/useFull/makeErrorLimitFreeInEnd'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  userId: string
  name: string
  type: 'book' | 'rpg' | 'roadMap' | 'gameplay'
  private?: boolean
  password?: string
}

@injectable()
export class CreateProjectUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute({
    name,
    private: priv,
    type,
    userId,
    password,
  }: IRequest): Promise<void> {
    const infoUser = await this.usersRepository.findById(userId)
    if (!infoUser) throw makeErrorUserNotFound()

    const numberOfProjectsThisUser = infoUser._count?.projects ?? 0

    if (
      numberOfProjectsThisUser >= 2 &&
      !infoUser.last_payment_date &&
      !infoUser.admin
    )
      throw makeErrorLimitFreeInEnd()

    const newProject = await this.projectsRepository.create({
      name,
      private: priv,
      type,
      password,
      user_id: userId,
      users_with_access_comment: {
        create: {},
      },
      users_with_access_edit: {
        create: {},
      },
      users_with_access_view: {
        create: {},
      },
    })

    if (!newProject) throw makeErrorProjectNotCreated()

    await this.cacheProvider.delete(KeysRedis.userProjectsPreview + userId)
  }
}
