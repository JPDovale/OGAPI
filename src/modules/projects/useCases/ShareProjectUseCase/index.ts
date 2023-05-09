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
import { makeInternalError } from '@shared/errors/useFull/makeInternalError'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

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
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    const userToAddProject = await this.usersRepository.findByEmail(email)
    if (!userToAddProject) throw makeErrorUserNotFound()

    const project = await this.projectsRepository.findById(projectId)
    if (!project) throw makeErrorProjectNotFound()

    const thisProjectAreFromUser = project.user_id === userId
    if (!thisProjectAreFromUser) throw makeErrorDeniedPermission()

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

    if (usersInProject.length >= 5 && !user.last_payment_date && !user.admin)
      throw makeErrorLimitFreeInEnd()

    const isAlreadySharedWithUser = usersInProject.find(
      (u) => u.email === email,
    )
    if (isAlreadySharedWithUser) throw makeErrorProjectAlreadySharedWithUser()

    const listToAddUser = project[
      mapperToFindListAccess[permission]
    ] as IProjectUsers

    if (!listToAddUser) throw makeInternalError()

    const newListUserWithAccess: IUserInProject[] = [
      ...listToAddUser.users,
      userToAddProject,
    ]

    const updatedProject = await this.projectsRepository.addUsers({
      projectId,
      users: newListUserWithAccess,
      permission,
    })
    if (!updatedProject) throw makeErrorProjectNotUpdate()

    await this.notifyUsersProvider.notifyOneUser({
      title: 'Projeto compartilhado',
      content: `${user.name} acabou de compartilhar o projeto "${project.name}" com você. Acesse os projetos compartilhados para ver.`,
      userToNotifyId: userToAddProject.id,
    })

    return { project: updatedProject }
  }
}
