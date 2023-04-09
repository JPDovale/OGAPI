import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectNotFound } from '@shared/errors/projects/makeErrorProjectNotFound'
import { makeErrorUserDoesPermissionToProject } from '@shared/errors/projects/makeErrorUserDoesPermissionToProject'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

import { type IVerifyPermissionsService } from '../IVerifyPermissions'
import { type IRequestVerify } from '../types/IRequestVerify'
import { type IResponseVerify } from '../types/IResponseVerify'

@injectable()
export class VerifyPermissions implements IVerifyPermissionsService {
  constructor(
    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async verify({
    projectId,
    userId,
    verifyPermissionTo,
  }: IRequestVerify): Promise<IResponseVerify> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    const project = await this.projectsRepository.findById(projectId)
    if (!project) throw makeErrorProjectNotFound()

    const usersWithPermissionToEdit = project.users_with_access_edit
    const usersWithPermissionToView = project.users_with_access_view
    const usersWithPermissionToComment = project.users_with_access_comment

    switch (verifyPermissionTo) {
      case 'edit': {
        const userHasPermission = !!usersWithPermissionToEdit?.users.find(
          (u) => u.id === user.id,
        )

        if (!userHasPermission)
          throw makeErrorUserDoesPermissionToProject('editar')

        break
      }

      case 'comment': {
        const userHasPermissionToComment =
          !!usersWithPermissionToComment?.users.find((u) => u.id === user.id)

        const userHasPermissionToEdit = !!usersWithPermissionToEdit?.users.find(
          (u) => u.id === user.id,
        )

        if (!userHasPermissionToComment && !userHasPermissionToEdit)
          throw makeErrorUserDoesPermissionToProject('comentar')

        break
      }

      case 'view': {
        const userHasPermissionView = !!usersWithPermissionToView?.users.find(
          (u) => u.id === user.id,
        )

        const userHasPermissionToEdit = !!usersWithPermissionToEdit?.users.find(
          (u) => u.id === user.id,
        )

        if (!userHasPermissionView && !userHasPermissionToEdit)
          throw makeErrorUserDoesPermissionToProject('visualizar')

        break
      }

      default:
        break
    }

    const response: IResponseVerify = {
      project,
      user,
    }

    return response
  }
}
