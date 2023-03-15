/* eslint-disable import/no-unresolved */
import { sign, verify } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import session from '@config/session'
import { IRefreshTokenRepository } from '@modules/accounts/infra/mongoose/repositories/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { makeErrorRefreshTokenInvalid } from '@shared/errors/refreshToken/makeErrorRefreshTokenInvalid'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IPayload {
  sub: string
  email: string
  admin: boolean
  name: string
}

interface ITokenRefreshResponse {
  refreshToken: string
  token: string
}
@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
    @inject('UsersRepository')
    private readonly userRepository: IUsersRepository,
  ) {}

  async execute(token: string): Promise<ITokenRefreshResponse> {
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

    if (!userToken) throw makeErrorRefreshTokenInvalid()

    await this.refreshTokenRepository.deleteById(userToken.id)
    const userExiste = await this.userRepository.findById(userId)

    if (!userExiste) throw makeErrorUserNotFound()

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
      .addDays(Number(session.expiresRefreshTokenDays))
      .toString()

    await this.refreshTokenRepository.create({
      expiresDate,
      refreshToken,
      userId,
    })

    const newToken = sign(
      {
        admin: userExiste.admin,
        name: userExiste.username,
        email: userExiste.email,
      },
      session.secretToken,
      {
        subject: userExiste.id,
        expiresIn: session.expiresInToken,
      },
    )

    return { refreshToken, token: newToken }
  }
}
