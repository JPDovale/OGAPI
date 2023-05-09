/* eslint-disable import/no-unresolved */
import { sign, verify } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import session from '@config/session'
import { IRefreshTokenRepository } from '@modules/accounts/infra/repositories/contracts/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorRefreshTokenInvalid } from '@shared/errors/refreshToken/makeErrorRefreshTokenInvalid'
import { makeErrorSessionExpires } from '@shared/errors/users/makeErrorSessionExpires'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IPayload {
  sub: string
  email: string
  admin: boolean
  name: string
}

interface IRequest {
  token: string
}

interface IResponse {
  refreshToken: string
  token: string
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.RefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @inject(InjectableDependencies.Providers.DateProvider)
    private readonly dateProvider: IDateProvider,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly userRepository: IUsersRepository,
  ) {}

  async execute({ token }: IRequest): Promise<IResponse> {
    if (!token) throw makeErrorSessionExpires()

    let userId = ''

    try {
      const { sub } = verify(token, session.secretRefreshToken) as IPayload

      userId = sub
    } catch (err) {
      throw makeErrorSessionExpires()
    }

    const userExiste = await this.userRepository.findById(userId)
    if (!userExiste) throw makeErrorUserNotFound()

    const userEssentialInfos = {
      admin: userExiste.admin,
      email: userExiste.email,
      id: userExiste.id,
      name: userExiste.name,
      username: userExiste.username,
      _count: {
        books: userExiste._count?.books ?? 0,
        projects: userExiste._count?.projects ?? 0,
      },
      last_payment_date: userExiste.last_payment_date,
    }

    const userToken =
      await this.refreshTokenRepository.findByUserIdAndRefreshToken(
        userId,
        token,
      )
    if (!userToken) throw makeErrorRefreshTokenInvalid()

    const tokenIsValid = this.dateProvider.isBefore({
      startDate: new Date(),
      endDate: userToken.expires_date,
    })

    if (!tokenIsValid) {
      await this.refreshTokenRepository.deleteById(userToken.id)
      throw makeErrorSessionExpires()
    }

    await this.refreshTokenRepository.deleteById(userToken.id)

    const refreshToken = sign(
      {
        admin: userEssentialInfos.admin,
        name: userEssentialInfos.name,
        email: userEssentialInfos.email,
      },
      session.secretRefreshToken,
      {
        subject: userId,
        expiresIn: session.expiresInRefreshToken,
      },
    )

    const expiresDate = this.dateProvider.addDays(
      Number(session.expiresRefreshTokenDays),
    )

    await this.refreshTokenRepository.create({
      expires_date: expiresDate,
      refresh_token: refreshToken,
      user_id: userId,
    })

    const newToken = sign(
      {
        admin: userEssentialInfos.admin,
        name: userEssentialInfos.name,
        email: userEssentialInfos.email,
      },
      session.secretToken,
      {
        subject: userEssentialInfos.id,
        expiresIn: session.expiresInToken,
      },
    )

    return { refreshToken, token: newToken }
  }
}
