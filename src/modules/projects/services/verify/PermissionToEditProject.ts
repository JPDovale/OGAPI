import { inject, injectable } from 'tsyringe'

import { IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
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

    if (!user) {
      throw new AppError('O usuário não existe', 404)
    }

    const project = await this.projectsRepository.findById(projectId)

    if (!project) {
      throw new AppError('O projeto não existe', 404)
    }

    const permissionOfThisUser = project.users.find(
      (user) => user.id === userId,
    )

    if (!permissionOfThisUser) {
      throw new AppError('Você não tem permissão para alterar o projeto', 401)
    }

    if (
      verifyPermissionTo === 'edit' &&
      permissionOfThisUser.permission !== 'edit'
    ) {
      throw new AppError('Você não tem permissão para alterar o projeto', 401)
    }

    if (
      verifyPermissionTo === 'comment' &&
      permissionOfThisUser.permission !== 'comment' &&
      permissionOfThisUser.permission !== 'edit'
    ) {
      throw new AppError(
        'Você não tem permissão para comentar nesse projeto',
        401,
      )
    }

    const response: IResponse = {
      permission: permissionOfThisUser.permission,
      project,
      user,
    }

    return response
  }
}
