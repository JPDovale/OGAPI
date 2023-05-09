import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { makeErrorUserNotUpdate } from '@shared/errors/users/makeErrorUserNotUpdate'

interface IRequest {
  userId: string
}

interface IResponse {
  user: IUserInfosResponse
}

@injectable()
export class DeleteAvatarUseCase {
  constructor(
    @inject(InjectableDependencies.Providers.StorageProvider)
    private readonly storageProvider: IStorageProvider,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({ userId }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw makeErrorUserNotFound()

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

    if (!updatedUser) throw makeErrorUserNotUpdate()

    const userResponse = {
      age: updatedUser.age,
      avatar_url: updatedUser.avatar_url,
      avatar_filename: updatedUser.avatar_filename,
      created_at: updatedUser.created_at,
      is_social_login: updatedUser.is_social_login,
      email: updatedUser.email,
      id: updatedUser.id,
      name: updatedUser.name,
      notifications: updatedUser.notifications ?? [],
      sex: updatedUser.sex,
      username: updatedUser.username,
      new_notifications: updatedUser.new_notifications,
    }

    return { user: userResponse }
  }
}
