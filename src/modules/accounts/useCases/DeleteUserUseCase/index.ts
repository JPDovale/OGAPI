import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
}

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Providers.StorageProvider)
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute({ userId }: IRequest): Promise<IResolve> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return {
        ok: false,
        error: makeErrorUserNotFound(),
      }
    }

    await this.usersRepository.delete(userId)
    if (user.avatar_filename) {
      await this.storageProvider.delete(user.avatar_filename, 'avatar')
    }

    return {
      ok: true,
    }
  }
}
