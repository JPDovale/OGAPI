import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { AppError } from '@shared/errors/AppError'

interface IUserRequest {
  email: string
  permission: 'view' | 'edit' | 'comment'
}

interface IResponseError {
  error: string
  email: string
}

@injectable()
export class UnshareProjectUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute(
    users: IUserRequest[],
    projectId: string,
    userId: string,
  ): Promise<IResponseError[]> {
    const errors: IResponseError[] = []

    const project = await this.projectsRepository.findById(projectId)

    if (!project) {
      throw new AppError('O projeto não existe', 404)
    }

    const thisProjectAreFromUser = project.createdPerUser === userId

    if (!thisProjectAreFromUser) {
      throw new AppError(
        'Você não tem permissão para editar o compartilhamento desse projeto, pois ele é de propriedade de outro usuário.',
        401,
      )
    }

    const usersWithAccess = users.filter((user) => {
      const shared = project.users.find((u) => u.email === user.email)
      if (shared) {
        return true
      } else {
        errors.push({
          email: user.email,
          error: 'Esse usuário não tem acesso ao projeto',
        })
        return false
      }
    })

    const usersAccessUpdate = project.users.filter((u) => {
      const userToRemove = usersWithAccess.find(
        (user) => user.email === u.email,
      )

      if (u.id === userId) {
        errors.push({
          email: userToRemove.email,
          error:
            'Você não pode ser removido de um projeto que criou. Caso não queira mais ver esse projeto, tente apaga-lo',
        })
        return true
      }

      if (userToRemove) {
        return false
      } else {
        return true
      }
    })

    await this.projectsRepository.addUsers(usersAccessUpdate, projectId)

    return errors
  }
}
