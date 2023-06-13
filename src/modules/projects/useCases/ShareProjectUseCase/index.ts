import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type IProject } from '@modules/projects/infra/repositories/entities/IProject'
import {
  type IProjectUsers,
  type IUserInProject,
} from '@modules/projects/infra/repositories/entities/IUsersWithAccess'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectAlreadySharedWithUser } from '@shared/errors/projects/makeErrorProjectAlreadySharedWithUser'
import { makeErrorProjectNotFound } from '@shared/errors/projects/makeErrorProjectNotFound'
import { makeErrorProjectNotUpdate } from '@shared/errors/projects/makeErrorProjectNotUpdate'
import { makeErrorDeniedPermission } from '@shared/errors/useFull/makeErrorDeniedPermission'
import { makeErrorLimitFreeInEnd } from '@shared/errors/useFull/makeErrorLimitFreeInEnd'
import { makeErrorLimitFreeOfAnotherUserInEnd } from '@shared/errors/useFull/makeErrorLimitFreeOfAnotherUserInEnd'
import { makeInternalError } from '@shared/errors/useFull/makeInternalError'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

type IPermission = 'view' | 'edit' | 'comment'

interface IRequest {
  email: string
  permission: IPermission
  projectId: string
  userId: string
}

interface IResponse {
  project: IProject
}

interface IMapperToFindListAccess {
  comment: 'users_with_access_comment'
  edit: 'users_with_access_edit'
  view: 'users_with_access_view'
}

const mapperToFindListAccess: IMapperToFindListAccess = {
  comment: 'users_with_access_comment',
  edit: 'users_with_access_edit',
  view: 'users_with_access_view',
}

@injectable()
export class ShareProjectUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,
  ) {}

  async execute({
    email,
    permission,
    projectId,
    userId,
  }: IRequest): Promise<IResolve<IResponse>> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return {
        ok: false,
        error: makeErrorUserNotFound(),
      }
    }

    const userToAddProject = await this.usersRepository.findByEmail(email)
    if (!userToAddProject) {
      return {
        ok: false,
        error: makeErrorUserNotFound(),
      }
    }

    const projectsOfUserToAddAlreadyIn =
      await this.projectsRepository.listProjectsOfOneUser(userId)

    const projectsOfUSerToAddOfAnotherUsers =
      projectsOfUserToAddAlreadyIn.filter(
        (project) => project.user?.id !== userId,
      )

    const project = await this.projectsRepository.findById(projectId)
    if (!project) {
      return {
        ok: false,
        error: makeErrorProjectNotFound(),
      }
    }

    const thisProjectAreFromUser = project.user_id === userId
    if (!thisProjectAreFromUser) {
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

    const usersInProject = [
      ...usersWithPermissionToComment,
      ...usersWithPermissionToEdit,
      ...usersWithPermissionToView,
    ]

    if (
      usersInProject.length >= 1 &&
      user.subscription?.payment_status !== 'active'
    ) {
      return {
        ok: false,
        error: makeErrorLimitFreeInEnd(),
      }
    }

    if (
      projectsOfUSerToAddOfAnotherUsers.length >= 3 &&
      userToAddProject.subscription?.payment_status !== 'active'
    ) {
      return {
        ok: false,
        error: makeErrorLimitFreeOfAnotherUserInEnd(),
      }
    }

    const isAlreadySharedWithUser = usersInProject.find(
      (u) => u.email === email,
    )
    if (isAlreadySharedWithUser) {
      return {
        ok: false,
        error: makeErrorProjectAlreadySharedWithUser(),
      }
    }

    const listToAddUser = project[
      mapperToFindListAccess[permission]
    ] as IProjectUsers

    if (!listToAddUser) {
      return {
        ok: false,
        error: makeInternalError(),
      }
    }

    const newListUserWithAccess: IUserInProject[] = [
      ...listToAddUser.users,
      userToAddProject,
    ]

    const updatedProject = await this.projectsRepository.addUsers({
      projectId,
      users: newListUserWithAccess,
      permission,
    })
    if (!updatedProject) {
      return {
        ok: false,
        error: makeErrorProjectNotUpdate(),
      }
    }

    await this.notifyUsersProvider.notifyOneUser({
      title: 'Projeto compartilhado',
      content: `${user.name} acabou de compartilhar o projeto "${project.name}" com você. Acesse os projetos compartilhados para ver.`,
      userToNotifyId: userToAddProject.id,
    })

    await this.usersRepository.removeCacheOfUser(userId)

    return {
      ok: true,
      data: {
        project: updatedProject,
      },
    }
  }
}
