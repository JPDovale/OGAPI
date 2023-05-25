import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { makeErrorUserNotUpdate } from '@shared/errors/users/makeErrorUserNotUpdate'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
}

interface IResponse {
  user: IUser
}

@injectable()
export class DeleteAvatarUseCase {
  constructor(
    @inject(InjectableDependencies.Providers.StorageProvider)
    private readonly storageProvider: IStorageProvider,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({ userId }: IRequest): Promise<IResolve<IResponse>> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return {
        ok: false,
        error: makeErrorUserNotFound(),
      }
    }

    if (user.avatar_filename) {
      await this.storageProvider.delete(user.avatar_filename, 'avatar')
    }

    const updatedUser = await this.usersRepository.updateUser({
      userId,
      data: {
        avatar_filename: null,
        avatar_url: null,
      },
    })
    if (!updatedUser) {
      return {
        ok: false,
        error: makeErrorUserNotUpdate(),
      }
    }

    return {
      ok: true,
      data: {
        user: updatedUser,
      },
    }
  }
}
