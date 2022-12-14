import { hashSync } from 'bcryptjs'
import { inject, injectable } from 'tsyringe'

import { IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { AppError } from '@shared/errors/AppError'

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
  ) {}

  async execute(request: IRequest): Promise<IUserMongo> {
    const { age, email, name, password, sex, username } = request

    const userAlreadyExiste = await this.usersRepository.findByEmail(email)

    if (userAlreadyExiste) {
      throw new AppError('Usuário já existente. Tente fazer login')
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

    return newUser
  }
}
