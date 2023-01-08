import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { AppError } from '@shared/errors/AppError'

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

  async execute(request: IRequest): Promise<IUserInfosResponse> {
    const { age, name, sex, username } = request

    const code = Math.floor(Math.random() * 100000000).toString()

    try {
      const newUser = await this.usersRepository.create({
        name,
        email: ' ',
        password: ' ',
        age: age || 'uncharacterized',
        sex: sex || 'uncharacterized',
        username: username || name,
        isInitialized: true,
        code,
      })

      const response: IUserInfosResponse = {
        age: newUser.age,
        email: newUser.email,
        sex: newUser.sex,
        username: newUser.username,
        avatar: newUser.avatar,
        createAt: newUser.createAt,
        id: newUser.id,
        notifications: newUser.notifications,
        updateAt: newUser.updateAt,
        name: newUser.name,
        isInitialized: newUser.isInitialized,
      }

      return response
    } catch (err) {
      console.log(err)

      throw new AppError({
        title: 'Internal error',
        message: 'Try again later.',
        statusCode: 500,
      })
    }
  }
}
