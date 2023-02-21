import fs from 'fs'
import { inject, injectable } from 'tsyringe'

import {
  Avatar,
  IAvatar,
} from '@modules/accounts/infra/mongoose/entities/Avatar'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { IStorageProvider } from '@shared/container/provides/StorageProvider/IStorageProvider'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class AvatarUpdateUseCase {
  constructor(
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute(
    file: Express.Multer.File,
    userId: string,
  ): Promise<IUserInfosResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user)
      throw new AppError({
        title: 'Usuário não encontrado.',
        message: 'Parece que esse usuário não existe na nossa base de dados...',
        statusCode: 404,
      })

    if (user?.avatar?.fileName) {
      try {
        await this.storageProvider.delete(user.avatar.fileName, 'avatar')
      } catch (err) {
        console.log(err)
      }
    }

    const url = await this.storageProvider.upload(file, 'avatar')
    let avatarToUpdate: IAvatar

    if (user.avatar.fileName) {
      const avatar: IAvatar = {
        ...user.avatar,
        fileName: file.filename,
        url,
        updatedAt: this.dateProvider.getDate(new Date()),
      }

      avatarToUpdate = avatar
    } else {
      const avatar = new Avatar({
        fileName: file.filename,
        url,
      })

      avatarToUpdate = avatar
    }

    const updatedUser = await this.usersRepository.updateAvatar(
      userId,
      avatarToUpdate,
    )

    const response: IUserInfosResponse = {
      age: updatedUser.age,
      email: updatedUser.email,
      sex: updatedUser.sex,
      username: updatedUser.username,
      avatar: updatedUser.avatar,
      createAt: updatedUser.createAt,
      id: updatedUser.id,
      notifications: updatedUser.notifications,
      updateAt: updatedUser.updateAt,
      isInitialized: updatedUser.isInitialized,
      name: updatedUser.name,
      isSocialLogin: updatedUser.isSocialLogin,
    }

    fs.rmSync(file.path)

    return response
  }
}
