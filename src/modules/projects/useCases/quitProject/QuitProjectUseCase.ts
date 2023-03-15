import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { makeErrorProjectNotFound } from '@shared/errors/projects/makeErrorProjectNotFound'
import { makeErrorProjectQuitAlreadyDone } from '@shared/errors/projects/makeErrorProjectQuitAlreadyDone'
import { makeErrorProjectQuitNotExecuted } from '@shared/errors/projects/makeErrorProjectQuitNotExecuted'
import { makeErrorProjectQuitPerCreator } from '@shared/errors/projects/makeErrorProjectQuitPerCreator'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  userId: string
  projectId: string
}

@injectable()
export class QuitProjectUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
  ) {}

  async execute({ userId, projectId }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)
    const project = await this.projectsRepository.findById(projectId)

    if (!project) throw makeErrorProjectNotFound()

    if (!user) throw makeErrorUserNotFound()

    if (userId === project.createdPerUser)
      throw makeErrorProjectQuitPerCreator()

    const isShared = project.users.find((u) => u.id === userId)

    if (!isShared) throw makeErrorProjectQuitAlreadyDone()

    const usersAccessUpdate = project.users.filter((u) => u.id !== userId)
    const updatedProject = await this.projectsRepository.addUsers(
      usersAccessUpdate,
      projectId,
    )

    if (!updatedProject) throw makeErrorProjectQuitNotExecuted()

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} saiu do projeto.`,
      `${user.username} acabou de sair do projeto ${project.name}`,
    )
  }
}
