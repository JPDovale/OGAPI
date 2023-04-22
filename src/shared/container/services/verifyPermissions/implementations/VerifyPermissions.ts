import { inject, injectable } from 'tsyringe'

import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectNotFound } from '@shared/errors/projects/makeErrorProjectNotFound'
import { makeErrorUserDoesPermissionToProject } from '@shared/errors/projects/makeErrorUserDoesPermissionToProject'

import { IUsersServices } from '../../usersServices/IUsersServices'
import { type IVerifyPermissionsService } from '../IVerifyPermissions'
import { type IRequestVerify } from '../types/IRequestVerify'
import { type IResponseVerify } from '../types/IResponseVerify'

@injectable()
export class VerifyPermissions implements IVerifyPermissionsService {
  constructor(
    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Services.UsersServices)
    private readonly usersServices: IUsersServices,
  ) {}

  async verify({
    projectId,
    userId,
    verifyPermissionTo,
  }: IRequestVerify): Promise<IResponseVerify> {
    const essentialInfosUser = await this.usersServices.getEssentialInfos(
      userId,
    )

    const project = await this.projectsRepository.findOneToVerifyPermission(
      projectId,
    )
    if (!project) throw makeErrorProjectNotFound()

    const usersWithPermissionToEdit = project.users_with_access_edit
    const usersWithPermissionToView = project.users_with_access_view
    const usersWithPermissionToComment = project.users_with_access_comment

    if (project.user.id !== userId) {
      switch (verifyPermissionTo) {
        case 'edit': {
          const userHasPermission = !!usersWithPermissionToEdit?.users?.find(
            (u) => u.id === essentialInfosUser.id,
          )

          if (!userHasPermission)
            throw makeErrorUserDoesPermissionToProject('editar')

          break
        }

        case 'comment': {
          const userHasPermissionToComment =
            !!usersWithPermissionToComment?.users.find(
              (u) => u.id === essentialInfosUser.id,
            )

          const userHasPermissionToEdit =
            !!usersWithPermissionToEdit?.users.find(
              (u) => u.id === essentialInfosUser.id,
            )

          if (!userHasPermissionToComment && !userHasPermissionToEdit)
            throw makeErrorUserDoesPermissionToProject('comentar')

          break
        }

        case 'view': {
          const userHasPermissionView = !!usersWithPermissionToView?.users.find(
            (u) => u.id === essentialInfosUser.id,
          )

          const userHasPermissionToEdit =
            !!usersWithPermissionToEdit?.users.find(
              (u) => u.id === essentialInfosUser.id,
            )

          const userHasPermissionToComment =
            !!usersWithPermissionToComment?.users.find(
              (u) => u.id === essentialInfosUser.id,
            )

          if (
            !userHasPermissionView &&
            !userHasPermissionToEdit &&
            !userHasPermissionToComment
          )
            throw makeErrorUserDoesPermissionToProject('visualizar')

          break
        }

        default:
          break
      }
    }

    const response: IResponseVerify = {
      project,
      user: essentialInfosUser,
    }

    return response
  }
}
