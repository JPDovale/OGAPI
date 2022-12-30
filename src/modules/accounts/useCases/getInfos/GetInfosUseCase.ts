import { inject, injectable } from 'tsyringe'

import { IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'

@injectable()
export class GetInfosUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly userRepository: IUsersRepository,
  ) {}

  async execute(userId: string): Promise<IUserMongo> {
    const user = await this.userRepository.findById(userId)
    return user
  }
}
