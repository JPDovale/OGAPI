import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
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
  ) {}

  async execute({
    name,
    private: priv,
    type,
    userId,
    password,
  }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    const numberOfProjectsThisUser = user._count?.projects ?? 0

    if (numberOfProjectsThisUser >= 2 && !user.last_payment_date && !user.admin)
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
  }
}
