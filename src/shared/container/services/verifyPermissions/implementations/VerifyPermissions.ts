import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { AppError } from '@shared/errors/AppError'

import { IVerifyPermissionsService } from '../IVerifyPermissions'
import { IRequestVerify } from '../types/IRequestVerify'
import { IResponseVerify } from '../types/IResponseVerify'

@injectable()
export class VerifyPermissions implements IVerifyPermissionsService {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async verify({
    projectId,
    userId,
    verifyPermissionTo,
  }: IRequestVerify): Promise<IResponseVerify> {
    const user = await this.usersRepository.findById(userId)

    if (!user)
      throw new AppError({
        title: 'Usuário não encontrado.',
        message: 'Parece que esse usuário não existe na nossa base de dados...',
        statusCode: 404,
      })

    const project = await this.projectsRepository.findById(projectId)

    if (!project)
      throw new AppError({
        title: 'Projeto não encontrado.',
        message: 'Parece que esse projeto não existe na nossa base de dados...',
        statusCode: 404,
      })

    const permissionOfThisUser = project.users.find(
      (user) => user.id === userId,
    )

    if (!permissionOfThisUser) {
      throw new AppError({
        title: 'Acesso negado!',
        message: 'Você não tem permissão para alterar o projeto.',
        statusCode: 401,
      })
    }

    if (
      verifyPermissionTo === 'edit' &&
      permissionOfThisUser.permission !== 'edit'
    ) {
      throw new AppError({
        title: 'Acesso negado!',
        message: 'Você não tem permissão para alterar o projeto.',
        statusCode: 401,
      })
    }

    if (
      verifyPermissionTo === 'comment' &&
      permissionOfThisUser.permission === 'view'
    ) {
      throw new AppError({
        title: 'Acesso negado!',
        message: 'Você não tem permissão para alterar o projeto.',
        statusCode: 401,
      })
    }

    const response: IResponseVerify = {
      permission: permissionOfThisUser.permission,
      project,
      user,
    }

    return response
  }
}
