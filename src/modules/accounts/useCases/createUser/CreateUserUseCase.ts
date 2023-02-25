import { hashSync } from 'bcryptjs'
import dotenv from 'dotenv'
import { inject, injectable } from 'tsyringe'

import { IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { ISharedWhitUsers } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { AppError } from '@shared/errors/AppError'
dotenv.config()

interface IRequest {
  name: string
  email: string
  password: string
  sex?: string
  age?: string
  username?: string
}

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute(request: IRequest): Promise<IUserMongo> {
    const { age, email, name, password, sex, username } = request

    const userAlreadyExiste = await this.usersRepository.findByEmail(email)

    if (userAlreadyExiste) {
      throw new AppError({
        title: 'O usuário já existe.',
        message:
          'Localizamos um usuário já cadastrado com esse e-mail. Por favor, tente fazer login.',
      })
    }

    const passwordHash = hashSync(password, 8)

    const newUser = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      age: age || 'uncharacterized',
      sex: sex || 'uncharacterized',
      username: username || name,
    })

    const projectWelcome = await this.projectsRepository.findById(
      process.env.ID_PROJECT_WELCOME,
    )

    if (projectWelcome) {
      const addUser: ISharedWhitUsers = {
        email: newUser.email,
        id: newUser.id,
        permission: 'view',
      }

      const usersAdded = [...projectWelcome.users, addUser]

      await this.projectsRepository.addUsers(
        usersAdded,
        process.env.ID_PROJECT_WELCOME,
      )
    }

    return newUser
  }
}
