import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import InjectableDependencies from '@shared/container/types'
import { makeErrorFeatureNotAddedOnProject } from '@shared/errors/projects/makeErrorFeatureNotAddedOnProject'
import { makeErrorProjectNotFound } from '@shared/errors/projects/makeErrorProjectNotFound'
import { makeErrorUserDoesPermissionToProject } from '@shared/errors/projects/makeErrorUserDoesPermissionToProject'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'
import { getFeatures } from '@utils/application/dataTransformers/projects/features'

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
    clearCache = false,
    verifyFeatureInProject = [],
  }: IRequestVerify): Promise<IResolve<IResponseVerify>> {
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

    const usersWithPermissionToEdit = project.users_with_access_edit
    const usersWithPermissionToView = project.users_with_access_view
    const usersWithPermissionToComment = project.users_with_access_comment
    const features = getFeatures(project.features_using)

    verifyFeatureInProject.map((featureToVerify) => {
      const featureIn = features[featureToVerify]

      if (!featureIn) {
        return {
          ok: false,
          error: makeErrorFeatureNotAddedOnProject(),
        }
      }

      return ''
    })

    if (project.user?.id !== userId) {
      switch (verifyPermissionTo) {
        case 'edit': {
          const userHasPermission = !!usersWithPermissionToEdit?.users?.find(
            (u) => u.id === user.id,
          )

          if (!userHasPermission) {
            return {
              ok: false,
              error: makeErrorUserDoesPermissionToProject('editar'),
            }
          }

          break
        }

        case 'comment': {
          const userHasPermissionToComment =
            !!usersWithPermissionToComment?.users.find((u) => u.id === user.id)

          const userHasPermissionToEdit =
            !!usersWithPermissionToEdit?.users.find((u) => u.id === user.id)

          if (!userHasPermissionToComment && !userHasPermissionToEdit) {
            return {
              ok: false,
              error: makeErrorUserDoesPermissionToProject('comentar'),
            }
          }

          break
        }

        case 'view': {
          const userHasPermissionView = !!usersWithPermissionToView?.users.find(
            (u) => u.id === user.id,
          )

          const userHasPermissionToEdit =
            !!usersWithPermissionToEdit?.users.find((u) => u.id === user.id)

          const userHasPermissionToComment =
            !!usersWithPermissionToComment?.users.find((u) => u.id === user.id)

          if (
            !userHasPermissionView &&
            !userHasPermissionToEdit &&
            !userHasPermissionToComment
          ) {
            return {
              ok: false,
              error: makeErrorUserDoesPermissionToProject('visualizar'),
            }
          }

          break
        }

        default:
          break
      }
    }

    if (clearCache) {
      await Promise.all([
        this.projectsRepository.removeProjectOfCache(projectId),
        this.usersRepository.removeCacheOfUser(userId),
      ])
    }

    return {
      ok: true,
      data: {
        project,
        user,
      },
    }
  }
}
