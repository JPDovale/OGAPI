import { inject, injectable } from 'tsyringe'

import { Notification } from '@modules/accounts/infra/mongoose/entities/Notification'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { ISharedWhitUsers } from '@modules/projects/infra/mongoose/entities/Project'
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
export class ShareProjectUseCase {
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
        'Você não tem permissão para compartilhar esse projeto, pois ele é de propriedade de outro usuário.',
        401,
      )
    }
    const userCreatorOfProject = await this.usersRepository.findById(
      project.createdPerUser,
    )

    const notAlreadyShared = users.filter((user) => {
      const shared = project.users.find((u) => u.email === user.email)
      if (!shared) {
        return true
      } else {
        errors.push({
          email: shared.email,
          error: 'Esse usuário já tem acesso ao projeto',
        })
        return false
      }
    })

    const usersToAdd = await Promise.all(
      notAlreadyShared.map(async (user) => {
        const userExist = await this.usersRepository.findByEmail(user.email)
        if (userExist) {
          const newNotification = new Notification({
            title: 'Projeto compartilhado',
            content: `${userCreatorOfProject.name} acabou de compartilhar o projeto "${project.name}" com você. Acesse a aba de compartilhados para ver.`,
          })

          const notificationsUpdated = [
            newNotification,
            ...userExist.notifications,
          ]

          await this.usersRepository.updateNotifications(
            userExist.id,
            notificationsUpdated,
          )

          return userExist
        } else {
          errors.push({
            email: user.email,
            error: 'Usuário não encontrado',
          })
          return null
        }
      }),
    )

    const validUsersToAdd = usersToAdd.filter((u) => u !== null)

    const usersAdded: ISharedWhitUsers[] = [...project.users]

    validUsersToAdd.forEach((user) => {
      const userToAdd = users.find((u) => u.email === user.email)

      const addUser = {
        email: user.email,
        id: user.id,
        permission: userToAdd.permission,
        username: user.username,
      }

      usersAdded.push(addUser)
    })

    await this.projectsRepository.addUsers(usersAdded, projectId)

    return errors
  }
}
