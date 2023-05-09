import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import InjectableDependencies from '@shared/container/types'

interface IResponse {
  users: IUser[]
}

@injectable()
export class ListUsersUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(): Promise<IResponse> {
    const allUses = await this.usersRepository.list()

    return { users: allUses }
  }
}
