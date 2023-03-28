import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { type IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

@injectable()
export class GetInfosUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly userRepository: IUsersRepository,
  ) {}

  async execute(userId: string): Promise<IUserInfosResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) throw makeErrorUserNotFound()

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
      name: user.name,
      isInitialized: user.isInitialized,
      isSocialLogin: user.isSocialLogin,
    }

    return response
  }
}
