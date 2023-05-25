/* eslint-disable import/no-unresolved */
import { sign, verify } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import session from '@config/session'
import { IRefreshTokenRepository } from '@modules/accounts/infra/repositories/contracts/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorSessionExpires } from '@shared/errors/users/makeErrorSessionExpires'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

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

  async execute({ token }: IRequest): Promise<IResolve<IResponse>> {
    if (!token) {
      return {
        ok: false,
        error: makeErrorSessionExpires(),
      }
    }

    let userId = ''

    try {
      const { sub } = verify(token, session.secretRefreshToken) as IPayload

      userId = sub
    } catch {
      return {
        ok: false,
        error: makeErrorSessionExpires(),
      }
    }

    const userExiste = await this.userRepository.findById(userId)
    if (!userExiste) {
      return {
        ok: false,
        error: makeErrorUserNotFound(),
      }
    }

    const userToken =
      await this.refreshTokenRepository.findByUserIdAndRefreshToken(
        userId,
        token,
      )
    if (!userToken) {
      return {
        ok: false,
        error: makeErrorSessionExpires(),
      }
    }

    const tokenIsValid = this.dateProvider.isBefore({
      startDate: new Date(),
      endDate: userToken.expires_date,
    })

    await this.refreshTokenRepository.deleteById(userToken.id)

    if (!tokenIsValid) {
      return {
        ok: false,
        error: makeErrorSessionExpires(),
      }
    }

    const refreshToken = sign(
      {
        admin: userExiste.admin,
        name: userExiste.name,
        email: userExiste.email,
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
        admin: userExiste.admin,
        name: userExiste.name,
        email: userExiste.email,
      },
      session.secretToken,
      {
        subject: userExiste.id,
        expiresIn: session.expiresInToken,
      },
    )

    return {
      ok: true,
      data: {
        refreshToken,
        token: newToken,
      },
    }
  }
}
