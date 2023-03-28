import { hashSync } from 'bcryptjs'
import { inject, injectable } from 'tsyringe'

import { IRefreshTokenRepository } from '@modules/accounts/infra/mongoose/repositories/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { makeErrorUserInvalidRecoveryPasswordToken } from '@shared/errors/users/makeErrorUserInvalidRecoveryPasswordToken'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  password: string
  token: string
}

@injectable()
export class RecoveryPasswordUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute({ password, token }: IRequest): Promise<void> {
    const userToken = await this.refreshTokenRepository.findByRefreshToken({
      refreshToken: token,
    })

    if (!userToken) throw makeErrorUserInvalidRecoveryPasswordToken()

    const endDateOfPasswordRecoveryRequest = new Date(userToken.expiresDate)

    const isExpired = this.dateProvider.isBefore({
      startDate: endDateOfPasswordRecoveryRequest,
      endDate: new Date(),
    })

    if (isExpired) throw makeErrorUserInvalidRecoveryPasswordToken()

    const passwordHash = hashSync(password, 8)

    const user = await this.usersRepository.findById(userToken.userId)

    if (!user) throw makeErrorUserNotFound()

    await this.usersRepository.updatePassword(user.id, passwordHash)
    await this.refreshTokenRepository.deleteById(userToken.id)
  }
}
