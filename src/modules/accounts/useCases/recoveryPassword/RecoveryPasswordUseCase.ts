import { hashSync } from 'bcryptjs'
import { inject, injectable } from 'tsyringe'

import { IRefreshTokenRepository } from '@modules/accounts/infra/mongoose/repositories/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { AppError } from '@shared/errors/AppError'

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

    if (!userToken) {
      throw new AppError({
        title: 'Token inválido ou expirado.',
        message:
          'Seu token de recuperação de senha é inválido ou está expirado. Tente pedir outro email de recuperação.',
        statusCode: 409,
      })
    }

    const endDateOfPasswordRecoveryRequest = new Date(userToken.expiresDate)

    const isExpired = this.dateProvider.isBefore({
      startDate: endDateOfPasswordRecoveryRequest,
      endDate: new Date(),
    })

    if (isExpired) {
      throw new AppError({
        title: 'Token inválido ou expirado.',
        message:
          'Seu token de recuperação de senha é inválido ou está expirado. Tente pedir outro email de recuperação.',
        statusCode: 409,
      })
    }

    const passwordHash = hashSync(password, 8)

    const user = await this.usersRepository.findById(userToken.userId)

    await this.usersRepository.updatePassword(user.id, passwordHash)
    await this.refreshTokenRepository.deleteById(userToken.id)
  }
}
