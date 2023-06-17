import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotCreated } from '@shared/errors/users/makeErrorUserNotCreated'
import { makeErrorUserNotUpdate } from '@shared/errors/users/makeErrorUserNotUpdate'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  email: string
  imageUrl?: string | null
  name?: string | null
}

interface IResponse {
  user: IUser
}

@injectable()
export class CreateUserOAuthUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({
    email,
    imageUrl,
    name,
  }: IRequest): Promise<IResolve<IResponse>> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      const newUser = await this.usersRepository.create({
        email,
        name: name ?? 'Anonymous',
        password: 'non-set',
        username: name ?? 'Anonymous',
        avatar_url: imageUrl,
        is_social_login: true,
      })

      if (!newUser) {
        return {
          ok: false,
          error: makeErrorUserNotCreated(),
        }
      }

      return {
        ok: true,
        data: {
          user: newUser,
        },
      }
    }

    const updatedUser = await this.usersRepository.updateUser({
      userId: user.id,
      data: {
        name: name ?? user.name,
        avatar_url: imageUrl,
        email,
        password: 'non-set',
        is_social_login: true,
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
