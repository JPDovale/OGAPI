import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { type IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { makeErrorUserNotUpdate } from '@shared/errors/users/makeErrorUserNotUpdate'

@injectable()
export class VisualizeNotificationsUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(userId: string): Promise<IUserInfosResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw makeErrorUserNotFound()

    const notificationsUpdated = user.notifications.map((notification) => {
      return {
        ...notification,
        isVisualized: true,
      }
    })

    await this.usersRepository.updateNotifications(userId, notificationsUpdated)
    const updatedUser = await this.usersRepository.findById(userId)

    if (!updatedUser) throw makeErrorUserNotUpdate()

    return {
      age: updatedUser.age,
      avatar: updatedUser.avatar,
      createAt: updatedUser.createAt,
      email: updatedUser.email,
      id: updatedUser.id,
      isInitialized: updatedUser.isInitialized,
      isSocialLogin: updatedUser.isSocialLogin,
      name: updatedUser.name,
      notifications: updatedUser.notifications,
      sex: updatedUser.sex,
      updateAt: updatedUser.updateAt,
      username: updatedUser.username,
    }
  }
}
