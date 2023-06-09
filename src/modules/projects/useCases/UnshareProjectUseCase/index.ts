import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type IProject } from '@modules/projects/infra/repositories/entities/IProject'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectAlreadyUnsharedWhitUser } from '@shared/errors/projects/makeErrorProjectAlreadyUnsharedWhitUser'
import { makeErrorProjectNotFound } from '@shared/errors/projects/makeErrorProjectNotFound'
import { makeErrorProjectQuitNotExecuted } from '@shared/errors/projects/makeErrorProjectQuitNotExecuted'
import { makeErrorDeniedPermission } from '@shared/errors/useFull/makeErrorDeniedPermission'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userToUnshareEmail: string
  projectId: string
  userId: string
}

interface IResponse {
  project: IProject
}

interface IAccessTo {
  userHasPermissionInProject: boolean
  accessTo: 'comment' | 'view' | 'edit'
  indexOfMap: number
}

@injectable()
export class UnshareProjectUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,
  ) {}

  async execute({
    projectId,
    userToUnshareEmail,
    userId,
  }: IRequest): Promise<IResolve<IResponse>> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return {
        ok: false,
        error: makeErrorUserNotFound(),
      }
    }

    const project = await this.projectsRepository.findById(projectId)
    if (!project) {
      return {
        ok: false,
        error: makeErrorProjectNotFound(),
      }
    }

    const userToUnshare = await this.usersRepository.findByEmail(
      userToUnshareEmail,
    )
    if (!userToUnshare) {
      return {
        ok: false,
        error: makeErrorUserNotFound(),
      }
    }

    const userAreCreatorOfProject = project.user_id === userId
    if (!userAreCreatorOfProject) {
      return {
        ok: false,
        error: makeErrorDeniedPermission(),
      }
    }

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
        (user) => user.id === userToUnshare.id,
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

    if (!userHaveAccessIn) {
      return {
        ok: false,
        error: makeErrorProjectAlreadyUnsharedWhitUser(),
      }
    }

    const usersWithAccess = mapUsersInProject[userHaveAccessIn.indexOfMap]
    const filteredUsersWithAccess = usersWithAccess.filter(
      (user) => user.id !== userToUnshare.id,
    )

    const updatedProject = await this.projectsRepository.addUsers({
      users: filteredUsersWithAccess,
      projectId,
      permission: userHaveAccessIn.accessTo,
    })

    if (!updatedProject) {
      return {
        ok: false,
        error: makeErrorProjectQuitNotExecuted(),
      }
    }

    await this.notifyUsersProvider.notifyOneUser({
      title: `Você foi removido do projeto ${project.name}`,
      content: `${user.name} acabou de remover você do projeto "${project.name}".`,
      userToNotifyId: userToUnshare.id,
    })

    return {
      ok: true,
      data: {
        project: updatedProject,
      },
    }
  }
}
