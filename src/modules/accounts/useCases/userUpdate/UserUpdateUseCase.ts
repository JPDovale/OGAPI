import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  username: string
  name: string
  email: string
  age: string
  sex: string
  userId: string
}

@injectable()
export class UserUpdateUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
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

    if (!user)
      throw new AppError({
        title: 'Usuário não encontrado.',
        message: 'Parece que esse usuário não existe na nossa base de dados...',
        statusCode: 404,
      })

    if (email && email !== user.email) {
      const userAlreadyExiste = await this.usersRepository.findByEmail(email)

      if (userAlreadyExiste)
        throw new AppError({
          title: 'Esse email já está em uso.',
          message:
            'O email que você está tentando usar já está sendo usado por outra conta...',
        })
    }

    const updatedUser = await this.usersRepository.updateUser(
      userId,
      (username = username || user.username),
      (name = name || user.name),
      (email = email || user.email),
      (age = age || user.age),
      (sex = sex || user.sex),
    )

    await this.cacheProvider.setInfo(`user-${updatedUser.id}`, {
      ...updatedUser._doc,
    })

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
