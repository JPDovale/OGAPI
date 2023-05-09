import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectNotFound } from '@shared/errors/projects/makeErrorProjectNotFound'
import { makeErrorDeniedPermission } from '@shared/errors/useFull/makeErrorDeniedPermission'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  projectId: string
  userId: string
}

@injectable()
export class DeleteProjectUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,

    @inject(InjectableDependencies.Providers.StorageProvider)
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute({ projectId, userId }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    const project = await this.projectsRepository.findById(projectId)
    if (!project) throw makeErrorProjectNotFound()

    if (project.user_id !== userId) throw makeErrorDeniedPermission()

    await this.projectsRepository.delete(projectId)
    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      creatorId: user.id,
      title: `${user.username} deletou o projeto.`,
      content: `${user.username} acabou de deletar o projeto o qual havia sido compartilhado com você: ${project.name} `,
    })

    if (project.image_filename) {
      await this.storageProvider.delete(
        project.image_filename,
        'projects/images',
      )
    }
  }
}
