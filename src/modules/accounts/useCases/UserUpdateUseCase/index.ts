import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { makeErrorUserAlreadyExistes } from '@shared/errors/users/makeErrorUserAlreadyExistes'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { makeErrorUserNotUpdate } from '@shared/errors/users/makeErrorUserNotUpdate'

interface IRequest {
  username?: string
  name?: string
  email?: string
  age?: string
  sex?: string
  userId: string
}

interface IResponse {
  user: IUserInfosResponse
}

@injectable()
export class UserUpdateUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({
    age,
    email,
    name,
    sex,
    userId,
    username,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw makeErrorUserNotFound()

    if (email && email !== user.email) {
      const userAlreadyExiste = await this.usersRepository.findByEmail(email)

      if (userAlreadyExiste) throw makeErrorUserAlreadyExistes()
    }

    const updatedUser = await this.usersRepository.updateUser({
      userId,
      data: {
        username,
        name,
        email,
        age,
        sex,
      },
    })

    if (!updatedUser) throw makeErrorUserNotUpdate()

    const response: IUserInfosResponse = {
      age: updatedUser.age,
      email: updatedUser.email,
      avatar_filename: updatedUser.avatar_filename,
      is_social_login: updatedUser.is_social_login,
      avatar_url: user.avatar_filename,
      created_at: user.created_at,
      sex: updatedUser.sex,
      username: updatedUser.username,
      id: updatedUser.id,
      notifications: updatedUser.notifications ?? [],
      name: updatedUser.name,
      new_notifications: updatedUser.new_notifications,
    }

    return { user: response }
  }
}
