import session from 'config/session'
import { sign, verify } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import { IRefreshTokenRepository } from '@modules/accounts/repositories/IRefreshTokenRepository'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { AppError } from '@shared/errors/AppError'

interface IPayload {
  sub: string
  email: string
  admin: boolean
  name: string
}
@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute(token: string): Promise<string> {
    const {
      email,
      sub: userId,
      admin,
      name,
    } = verify(token, session.secretRefreshToken) as IPayload

    const userToken =
      await this.refreshTokenRepository.findByUserIdAndRefreshToken(
        userId,
        token,
      )

    if (!userToken) {
      throw new AppError('RefreshToken inexistente')
    }

    await this.refreshTokenRepository.deleteById(userToken.id)

    const refreshToken = sign(
      {
        admin,
        name,
        email,
      },
      session.secretRefreshToken,
      {
        subject: userId,
        expiresIn: session.expiresInRefreshToken,
      },
    )

    const expiresDate = this.dateProvider
      .addDays(session.expiresRefreshTokenDays)
      .toString()

    await this.refreshTokenRepository.create({
      expiresDate,
      refreshToken,
      userId,
    })

    return refreshToken
  }
}
