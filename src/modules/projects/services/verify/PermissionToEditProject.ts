import { inject, injectable } from 'tsyringe'

import { IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { AppError } from '@shared/errors/AppError'

interface IResponse {
  permission: 'edit' | 'comment' | string
  project: IProjectMongo
  user: IUserMongo
}

@injectable()
export class PermissionToEditProject {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async verify(
    userId: string,
    projectId: string,
    verifyPermissionTo: 'edit' | 'comment',
  ): Promise<IResponse> {
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

    const response: IResponse = {
      permission: permissionOfThisUser.permission,
      project,
      user,
    }

    return response
  }
}
