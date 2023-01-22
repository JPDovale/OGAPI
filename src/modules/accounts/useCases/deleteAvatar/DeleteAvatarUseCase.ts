import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { IStorageProvider } from '@shared/container/provides/StorageProvider/IStorageProvider'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class DeleteAvatarUseCase {
  constructor(
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute(id: string): Promise<IUserInfosResponse> {
    const user = await this.usersRepository.findById(id)

    if (!user)
      throw new AppError({
        title: 'Usuário não encontrado.',
        message: 'Parece que esse usuário não existe na nossa base de dados...',
        statusCode: 404,
      })

    try {
      if (user?.avatar?.fileName) {
        await this.storageProvider.delete(user.avatar.fileName, 'avatar')
      }

      const updatedUser = await this.usersRepository.updateAvatar(id, {
        fileName: '',
        url: '',
        updatedAt: this.dateProvider.getDate(new Date()),
      })

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
    } catch (err) {
      console.log(err)

      throw new AppError({
        title: 'Internal error',
        message: 'Try again later.',
        statusCode: 500,
      })
    }
  }
}
