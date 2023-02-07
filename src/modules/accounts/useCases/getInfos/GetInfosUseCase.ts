import { inject, injectable } from 'tsyringe'

import { IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { ICacheProvider } from '@shared/container/provides/CacheProvider/ICacheProvider'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class GetInfosUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly userRepository: IUsersRepository,
    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute(userId: string): Promise<IUserInfosResponse> {
    const userInCache = (await this.cacheProvider.getInfo(
      `user-${userId}`,
    )) as IUserMongo

    if (userInCache) {
      const user = userInCache

      return {
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
    }

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
      name: user.name,
      isInitialized: user.isInitialized,
      isSocialLogin: user.isSocialLogin,
    }

    await this.cacheProvider.setInfo(`user-${userId}`, { ...user._doc })

    return response
  }
}
