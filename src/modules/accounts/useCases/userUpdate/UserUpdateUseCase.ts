import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
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
  }: IRequest): Promise<IUserInfosResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw makeErrorUserNotFound()

    if (email && email !== user.email) {
      const userAlreadyExiste = await this.usersRepository.findByEmail(email)

      if (userAlreadyExiste) throw makeErrorUserAlreadyExistes()
    }

    const updatedUser = await this.usersRepository.updateUser(
      userId,
      (username = username ?? user.username),
      (name = name ?? user.name),
      (email = email ?? user.email),
      (age = age ?? user.age),
      (sex = sex ?? user.sex),
    )

    if (!updatedUser) throw makeErrorUserNotUpdate()

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
      isInitialized: user.isInitialized,
      name: updatedUser.name,
      isSocialLogin: user.isSocialLogin,
    }

    return response
  }
}
