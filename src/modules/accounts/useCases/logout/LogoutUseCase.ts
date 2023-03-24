import { inject, injectable } from 'tsyringe'

import { IRefreshTokenRepository } from '@modules/accounts/infra/mongoose/repositories/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

@injectable()
export class LogoutUseCase {
  constructor(
    @inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id)

    if (!user) throw makeErrorUserNotFound()

    await this.refreshTokenRepository.deletePerUserId(id)
  }
}
