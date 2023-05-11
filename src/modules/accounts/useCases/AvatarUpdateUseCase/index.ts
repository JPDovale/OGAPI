import fs from 'fs'
import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorFileNotUploaded } from '@shared/errors/useFull/makeErrorFileNotUploaded'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { makeErrorUserNotUpdate } from '@shared/errors/users/makeErrorUserNotUpdate'

interface IRequest {
  file: Express.Multer.File | undefined
  userId: string
}

interface IResponse {
  user: IUserInfosResponse
}

@injectable()
export class AvatarUpdateUseCase {
  constructor(
    @inject(InjectableDependencies.Providers.StorageProvider)
    private readonly storageProvider: IStorageProvider,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({ file, userId }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw makeErrorUserNotFound()
    if (!file) throw makeErrorFileNotUploaded()

    if (user.avatar_filename) {
      try {
        await this.storageProvider.delete(user.avatar_filename, 'avatar')
      } catch (err) {
        console.log(err)
      }
    }

    const url = await this.storageProvider.upload(file, 'avatar')

    const updatedUser = await this.usersRepository.updateUser({
      userId,
      data: {
        avatar_filename: file.filename,
        avatar_url: url,
      },
    })

    if (!updatedUser) throw makeErrorUserNotUpdate()

    const response: IUserInfosResponse = {
      age: updatedUser.age,
      email: updatedUser.email,
      sex: updatedUser.sex,
      username: updatedUser.username,
      avatar_filename: updatedUser.avatar_filename,
      avatar_url: updatedUser.avatar_url,
      created_at: updatedUser.created_at,
      id: updatedUser.id,
      notifications: updatedUser.notifications ?? [],
      name: updatedUser.name,
      is_social_login: updatedUser.is_social_login,
      new_notifications: updatedUser.new_notifications,
    }

    fs.rmSync(file.path)

    return {
      user: response,
    }
  }
}
