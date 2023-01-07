import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class GetInfosUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly userRepository: IUsersRepository,
  ) {}

  async execute(userId: string): Promise<IUserInfosResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user)
      throw new AppError({
        title: 'Usuário não encontrado.',
        message: 'Parece que esse usuário não existe na nossa base de dados...',
        statusCode: 404,
      })

    const response: IUserInfosResponse = {
      age: user.age,
      email: user.email,
      sex: user.sex,
      username: user.username,
      avatar: user.avatar,
      createAt: user.createAt,
      id: user.id,
      notifications: user.notifications,
      updateAt: user.updateAt,
    }

    return response
  }
}
