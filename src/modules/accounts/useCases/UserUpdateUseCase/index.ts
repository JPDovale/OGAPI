import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserAlreadyExistes } from '@shared/errors/users/makeErrorUserAlreadyExistes'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { makeErrorUserNotUpdate } from '@shared/errors/users/makeErrorUserNotUpdate'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  username?: string
  name?: string
  email?: string
  age?: string
  sex?: string
  userId: string
}

interface IResponse {
  user: IUser
}

@injectable()
export class UserUpdateUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({
    age,
    email,
    name,
    sex,
    userId,
    username,
  }: IRequest): Promise<IResolve<IResponse>> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return {
        ok: false,
        error: makeErrorUserNotFound(),
      }
    }

    if (email && email !== user.email) {
      const userAlreadyExiste = await this.usersRepository.findByEmail(email)
      if (userAlreadyExiste) {
        return {
          ok: false,
          error: makeErrorUserAlreadyExistes(),
        }
      }
    }

    const updatedUser = await this.usersRepository.updateUser({
      userId,
      data: {
        username: username ?? user.username,
        name: name ?? user.name,
        email: email ?? user.email,
        age: age ?? user.age,
        sex: sex ?? user.sex,
      },
    })

    if (!updatedUser) {
      return {
        ok: false,
        error: makeErrorUserNotUpdate(),
      }
    }

    return {
      ok: true,
      data: {
        user: updatedUser,
      },
    }
  }
}
