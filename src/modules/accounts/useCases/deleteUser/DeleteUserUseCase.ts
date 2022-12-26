import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IStorageProvider } from '@shared/container/provides/StorageProvider/IStorageProvider'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new AppError('Usuário não encontrado', 404)
    }

    try {
      await this.usersRepository.delete(id)
      if (user.avatar) {
        const destruct = user.avatar.split('F')[1]
        const filename = destruct.split('?')[0]
        await this.storageProvider.delete(filename, 'avatar')
      }
    } catch (err) {
      throw new AppError('Não foi possível deletar o usuário', 500)
    }
  }
}
