import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { type IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { makeErrorUserNotUpdate } from '@shared/errors/users/makeErrorUserNotUpdate'

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

    if (!user) throw makeErrorUserNotFound()

    if (user.avatar?.fileName) {
      await this.storageProvider.delete(user.avatar.fileName, 'avatar')
    }

    const updatedUser = await this.usersRepository.updateAvatar(id, {
      fileName: '',
      url: '',
      updatedAt: this.dateProvider.getDate(new Date()),
      createdAt:
        user.avatar?.createdAt ?? this.dateProvider.getDate(new Date()),
    })

    if (!updatedUser) throw makeErrorUserNotUpdate()

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
  }
}
