import { inject, injectable } from 'tsyringe'

import { type IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'

@injectable()
export class ListUsersUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(): Promise<IUserMongo[]> {
    const allUses = await this.usersRepository.list()

    return allUses
  }
}
