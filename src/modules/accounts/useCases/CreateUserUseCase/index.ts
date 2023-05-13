import { hashSync } from 'bcryptjs'
import dotenv from 'dotenv'
import { inject, injectable } from 'tsyringe'

import { env } from '@env/index'
import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserAlreadyExistes } from '@shared/errors/users/makeErrorUserAlreadyExistes'
import { makeErrorUserNotCreated } from '@shared/errors/users/makeErrorUserNotCreated'
dotenv.config()

interface IRequest {
  name: string
  email: string
  password: string
  sex?: string
  age?: string
  username?: string
}

interface IResponse {
  user: IUser
}

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Providers.MailGunProvider)
    private readonly mailProvider: IMailProvider,
  ) {}

  async execute(request: IRequest): Promise<IResponse> {
    const { age, email, name, password, sex, username } = request

    const userAlreadyExiste = await this.usersRepository.findByEmail(email)
    if (userAlreadyExiste) throw makeErrorUserAlreadyExistes()

    const passwordHash = hashSync(password, 8)

    const newUser = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      age,
      sex,
      username: username ?? name,
    })

    if (!newUser) throw makeErrorUserNotCreated()

    const projectWelcome = await this.projectsRepository.findById(
      env.ID_PROJECT_WELCOME,
    )

    if (projectWelcome) {
      const usersAlreadyInProject = projectWelcome.users_with_access_view
        ? projectWelcome.users_with_access_view.users
        : []

      const usersAdded = [...usersAlreadyInProject, newUser]

      await this.projectsRepository.addUsers({
        users: usersAdded,
        projectId: env.ID_PROJECT_WELCOME,
        permission: 'view',
      })
    }

    await this.mailProvider.registerInMailMarketing({
      email: newUser.email,
      attributes: {
        NOME: newUser.name,
      },
    })

    return { user: newUser }
  }
}
