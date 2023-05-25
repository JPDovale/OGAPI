import { hashSync } from 'bcryptjs'
import { inject, injectable } from 'tsyringe'

import { IRefreshTokenRepository } from '@modules/accounts/infra/repositories/contracts/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserInvalidRecoveryPasswordToken } from '@shared/errors/users/makeErrorUserInvalidRecoveryPasswordToken'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  password: string
  token: string
}

@injectable()
export class RecoveryPasswordUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Repositories.RefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @inject(InjectableDependencies.Providers.DateProvider)
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute({ password, token }: IRequest): Promise<IResolve> {
    const userToken = await this.refreshTokenRepository.findByRefreshToken({
      refreshToken: token,
    })

    if (!userToken) {
      return {
        ok: false,
        error: makeErrorUserInvalidRecoveryPasswordToken(),
      }
    }

    const endDateOfPasswordRecoveryRequest = new Date(userToken.expires_date)
    const isExpired = this.dateProvider.isBefore({
      startDate: endDateOfPasswordRecoveryRequest,
      endDate: new Date(),
    })

    if (isExpired) {
      return {
        ok: false,
        error: makeErrorUserInvalidRecoveryPasswordToken(),
      }
    }

    const passwordHash = hashSync(password, 8)

    const user = await this.usersRepository.findById(userToken.user_id)
    if (!user) {
      return {
        ok: false,
        error: makeErrorUserNotFound(),
      }
    }

    await this.usersRepository.updateUser({
      userId: user.id,
      data: { password: passwordHash },
    })
    await this.refreshTokenRepository.deleteById(userToken.id)

    return {
      ok: true,
    }
  }
}
