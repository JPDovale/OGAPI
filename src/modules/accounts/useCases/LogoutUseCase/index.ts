import { inject, injectable } from 'tsyringe'

import { IRefreshTokenRepository } from '@modules/accounts/infra/repositories/contracts/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
}

@injectable()
export class LogoutUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.RefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({ userId }: IRequest): Promise<IResolve> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return {
        ok: false,
        error: makeErrorUserNotFound(),
      }
    }

    await this.refreshTokenRepository.deletePerUserId(userId)

    return {
      ok: true,
    }
  }
}
