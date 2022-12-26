import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'

interface IRequest {
  name: string
  sex?: string
  age?: string
  username?: string
}

@injectable()
export class CreateUserPerAdminUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(request: IRequest): Promise<void> {
    const { age, name, sex, username } = request

    const code = Math.floor(Math.random() * 100000000).toString()

    await this.usersRepository.create({
      name,
      email: ' ',
      password: ' ',
      age: age || 'uncharacterized',
      sex: sex || 'uncharacterized',
      username: username || name,
      isInitialized: true,
      code,
    })
  }
}
