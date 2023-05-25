import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'
// import { makeErrorUserNotUpdate } from '@shared/errors/users/makeErrorUserNotUpdate'

interface IRequest {
  userId: string
}

interface IResponse {
  user: IUser
}

@injectable()
export class VisualizeNotificationsUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({ userId }: IRequest): Promise<IResolve<IResponse>> {
    const updatedUser = await this.usersRepository.updateUser({
      userId,
      data: {
        new_notifications: 0,
      },
    })
    if (!updatedUser) {
      return {
        ok: false,
        error: makeErrorUserNotFound(),
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
