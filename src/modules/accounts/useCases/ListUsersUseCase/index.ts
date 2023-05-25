import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUserUnchecked } from '@modules/accounts/infra/repositories/entities/IUser'
import InjectableDependencies from '@shared/container/types'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  page?: number
}

interface IResponse {
  users: IUserUnchecked[]
}

@injectable()
export class ListUsersUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(req?: IRequest): Promise<IResolve<IResponse>> {
    const page = req?.page ?? 1
    const users = await this.usersRepository.list({ page })

    return {
      ok: true,
      data: {
        users,
      },
    }
  }
}
