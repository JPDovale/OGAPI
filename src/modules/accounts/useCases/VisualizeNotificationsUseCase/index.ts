import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
// import { makeErrorUserNotUpdate } from '@shared/errors/users/makeErrorUserNotUpdate'

interface IRequest {
  userId: string
}

interface IResponse {
  user: IUserInfosResponse
}

@injectable()
export class VisualizeNotificationsUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({ userId }: IRequest): Promise<IResponse> {
    const updatedUser = await this.usersRepository.visualizeNotifications(
      userId,
    )

    if (!updatedUser) throw makeErrorUserNotFound()

    const userInfos = {
      avatar_filename: updatedUser.avatar_filename,
      avatar_url: updatedUser.avatar_url,
      created_at: updatedUser.created_at,
      is_social_login: updatedUser.is_social_login,
      age: updatedUser.age,
      email: updatedUser.email,
      id: updatedUser.id,
      name: updatedUser.name,
      notifications: updatedUser.notifications ?? [],
      sex: updatedUser.sex,
      username: updatedUser.username,
      new_notifications: updatedUser.new_notifications,
    }

    return { user: userInfos }
  }
}
