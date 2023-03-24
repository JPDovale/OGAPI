import { inject, injectable } from 'tsyringe'

import { IRefreshTokenRepository } from '@modules/accounts/infra/mongoose/repositories/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id)

    if (!user) throw makeErrorUserNotFound()

    await this.usersRepository.delete(id)
    await this.projectsRepository.deletePerUserId(id)
    await this.personsRepository.deletePerUserId(id)
    await this.refreshTokenRepository.deletePerUserId(id)
    await this.booksRepository.deletePerUserId(id)

    if (user?.avatar?.fileName) {
      await this.storageProvider.delete(user.avatar.fileName, 'avatar')
    }
  }
}
