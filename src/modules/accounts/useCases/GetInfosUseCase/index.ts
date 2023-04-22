import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUserPreview } from '@modules/accounts/responses/IUserPreview'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { KeysRedis } from '@shared/container/providers/CacheProvider/types/Keys'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  userId: string
}

interface IResponse {
  user: IUserPreview
}

@injectable()
export class GetInfosUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly userRepository: IUsersRepository,

    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute({ userId }: IRequest): Promise<IResponse> {
    let userPreview: IUserPreview

    const userAndProjectPreview = await this.cacheProvider.getInfo<IResponse>(
      KeysRedis.userPreview + userId,
    )

    if (!userAndProjectPreview) {
      const user = await this.userRepository.getPreviewUser(userId)
      if (!user) throw makeErrorUserNotFound()

      userPreview = user

      await this.cacheProvider.setInfo<IResponse>(
        KeysRedis.userPreview + userId,
        { user: userPreview },
        60 * 60 * 6, // 6 hours
      )
    } else {
      userPreview = userAndProjectPreview.user
    }

    return { user: userPreview }
  }
}
