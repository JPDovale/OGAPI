import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  id: string
}

interface IResponse {
  user: IUser
}

@injectable()
export class GetUserUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({ id }: IRequest): Promise<IResolve<IResponse>> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      return {
        ok: false,
        error: makeErrorUserNotFound(),
      }
    }

    return {
      ok: true,
      data: {
        user,
      },
    }
  }
}
