import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectNotFound } from '@shared/errors/projects/makeErrorProjectNotFound'
import { makeErrorProjectQuitAlreadyDone } from '@shared/errors/projects/makeErrorProjectQuitAlreadyDone'
import { makeErrorProjectQuitNotExecuted } from '@shared/errors/projects/makeErrorProjectQuitNotExecuted'
import { makeErrorProjectQuitPerCreator } from '@shared/errors/projects/makeErrorProjectQuitPerCreator'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  userId: string
  projectId: string
}

interface IAccessTo {
  userHasPermissionInProject: boolean
  accessTo: 'comment' | 'view' | 'edit'
  indexOfMap: number
}

@injectable()
export class QuitProjectUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,
  ) {}

  async execute({ userId, projectId }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    const project = await this.projectsRepository.findById(projectId)
    if (!project) throw makeErrorProjectNotFound()

    if (userId === project.user_id) throw makeErrorProjectQuitPerCreator()

    const usersWithPermissionToComment =
      project.users_with_access_comment?.users ?? []
    const usersWithPermissionToEdit =
      project.users_with_access_edit?.users ?? []
    const usersWithPermissionToView =
      project.users_with_access_view?.users ?? []

    // this is created to separate the different types of accesses
    const mapUsersInProject = [
      [...usersWithPermissionToComment],
      [...usersWithPermissionToEdit],
      [...usersWithPermissionToView],
    ]

    // this checks if the user has access to any of the possible access types and returns it in an array
    const accessIn: IAccessTo[] = mapUsersInProject.map((map, i) => {
      const userHasPermissionInProject = !!map.find(
        (user) => user.id === userId,
      )

      return {
        accessTo: i === 0 ? 'comment' : i === 1 ? 'edit' : 'view',
        indexOfMap: i,
        userHasPermissionInProject,
      }
    })

    // this finds in one of the types the user permission
    const userHaveAccessIn = accessIn.find(
      (access) => access.userHasPermissionInProject,
    )

    if (!userHaveAccessIn) throw makeErrorProjectQuitAlreadyDone()

    // this select part of map of users with access based in type of permission this user and make filter to remove then of project
    const usersWithAccess = mapUsersInProject[userHaveAccessIn.indexOfMap]
    const filteredUsersWithAccess = usersWithAccess.filter(
      (user) => user.id !== userId,
    )

    const updatedProject = await this.projectsRepository.addUsers({
      users: filteredUsersWithAccess,
      projectId,
      permission: userHaveAccessIn.accessTo,
    })

    if (!updatedProject) throw makeErrorProjectQuitNotExecuted()

    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      title: `${user.username} saiu do projeto.`,
      content: `${user.username} acabou de sair do projeto ${project.name}`,
    })
  }
}
