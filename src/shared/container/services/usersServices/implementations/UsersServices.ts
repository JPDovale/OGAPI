import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUserEssentialInfos } from '@modules/accounts/infra/repositories/entities/IUserEssentialInfos'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { KeysRedis } from '@shared/container/providers/CacheProvider/types/Keys'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

import { type IUsersServices } from '../IUsersServices'

@injectable()
export class UsersServices implements IUsersServices {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async getEssentialInfos(userId: string): Promise<IUserEssentialInfos> {
    let essentialInfosUser: IUserEssentialInfos | null = null
    essentialInfosUser = await this.cacheProvider.getInfo<IUserEssentialInfos>(
      KeysRedis.userEssentialInfos + userId,
    )

    if (!essentialInfosUser) {
      const user = await this.usersRepository.findById(userId)
      if (!user) throw makeErrorUserNotFound()

      essentialInfosUser = {
        id: user.id,
        admin: user.admin,
        email: user.email,
        name: user.name,
        username: user.username,
      }

      await this.cacheProvider.setInfo<IUserEssentialInfos>(
        KeysRedis.userEssentialInfos + userId,
        essentialInfosUser,
        KeysRedis.userEssentialInfosExpires, // 3 days
      )
    }

    return essentialInfosUser
  }
}
