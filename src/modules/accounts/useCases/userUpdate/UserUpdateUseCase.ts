import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class UserUpdateUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(
    username: string,
    name: string,
    email: string,
    age: string,
    sex: string,
    userId: string,
  ): Promise<IUserInfosResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user)
      throw new AppError({
        title: 'Usuário não encontrado.',
        message: 'Parece que esse usuário não existe na nossa base de dados...',
        statusCode: 404,
      })

    if (email) {
      const userAlreadyExiste = await this.usersRepository.findByEmail(email)

      if (userAlreadyExiste)
        throw new AppError({
          title: 'Esse email já está em uso.',
          message:
            'O email que você está tentando usar já está sendo usado por outra conta...',
        })
    }

    try {
      const updatedUser = await this.usersRepository.updateUser(
        userId,
        (username = username || user.username),
        (name = name || user.name),
        (email = email || user.email),
        (age = age || user.age),
        (sex = sex || user.sex),
      )

      const response: IUserInfosResponse = {
        age: updatedUser.age,
        email: updatedUser.email,
        sex: updatedUser.sex,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
        createAt: updatedUser.createAt,
        id: updatedUser.id,
        notifications: updatedUser.notifications,
        updateAt: updatedUser.updateAt,
        isInitialized: user.isInitialized,
        name: updatedUser.name,
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
