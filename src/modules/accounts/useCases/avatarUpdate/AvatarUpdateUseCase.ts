import fs from 'fs'
import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IStorageProvider } from '@shared/container/provides/StorageProvider/IStorageProvider'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class AvatarUpdateUseCase {
  constructor(
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(file: Express.Multer.File, userId: string): Promise<void> {
    if (!file) {
      throw new AppError(
        'Algumas informações estão ausentes na requisição, porem são indispensáveis para o funcionamento.',
        409,
      )
    }

    try {
      const user = await this.usersRepository.findById(userId)
      if (user.avatar) {
        const destruct = user.avatar.split('F')[1]
        const filename = destruct.split('?')[0]
        await this.storageProvider.delete(filename, 'avatar')
      }

      const url = await this.storageProvider.upload(file, 'avatar')

      await this.usersRepository.updateAvatar(userId, url)

      fs.rmSync(file.path)
    } catch (err) {
      throw new AppError('Não foi possível alterar a imagem de perfil', 500)
    }
  }
}
