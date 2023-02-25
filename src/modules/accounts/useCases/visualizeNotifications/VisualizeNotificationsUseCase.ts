import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class VisualizeNotificationsUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute(userId: string): Promise<IUserInfosResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new AppError({
        title: 'Usuário não encontrado.',
        message: 'Parece que esse usuário não existe na nossa base de dados...',
        statusCode: 404,
      })
    }

    const notificationsUpdated = user.notifications.map((notification) => {
      return {
        ...notification,
        isVisualized: true,
      }
    })

    await this.usersRepository.updateNotifications(userId, notificationsUpdated)
    const updatedUser = await this.usersRepository.findById(userId)

    await this.cacheProvider.setInfo(`user-${userId}`, { ...updatedUser._doc })

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
