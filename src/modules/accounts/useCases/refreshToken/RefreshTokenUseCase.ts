/* eslint-disable import/no-unresolved */
import { sign, verify } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import session from '@config/session'
import { IRefreshTokenRepository } from '@modules/accounts/repositories/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { AppError } from '@shared/errors/AppError'

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
    try {
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
        throw new AppError({
          title: 'RefreshToken inexistente',
          message: 'Esse token não existe.',
        })
      }

      const userExiste = await this.userRepository.findById(userId)
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
    } catch (err) {
      console.log(err)
      throw new AppError({ title: 'Invalid token', message: 'Invalid token' })
    }
  }
}
