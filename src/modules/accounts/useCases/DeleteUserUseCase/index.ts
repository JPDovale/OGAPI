import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

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

    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Repositories.BooksRepository)
    private readonly booksRepository: IBooksRepository,
  ) {}

  async execute({ userId }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw makeErrorUserNotFound()

    await this.usersRepository.delete(userId)

    if (user.avatar_filename) {
      await this.storageProvider.delete(user.avatar_filename, 'avatar')
    }
  }
}
