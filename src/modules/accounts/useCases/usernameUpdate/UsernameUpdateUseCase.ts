import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class UsernameUpdateUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(username: string, userId: string): Promise<IUserInfosResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user)
      throw new AppError({
        title: 'Usuário não encontrado.',
        message: 'Parece que esse usuário não existe na nossa base de dados...',
        statusCode: 404,
      })

    try {
      const updatedUser = await this.usersRepository.updateUsername(
        userId,
        username,
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
