import { compareSync } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import session from '@config/session'
import { IRefreshTokenRepository } from '@modules/accounts/infra/repositories/contracts/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorAccessDenied } from '@shared/errors/useFull/makeErrorAccessDenied'
import { makeErrorUserInvalidCredentialsToLogin } from '@shared/errors/users/makeErrorUserInvalidCredentialsToLogin'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  email: string
  password: string
  verifyIsAdmin?: boolean
  onApplication: string
}

interface IResponse {
  user: IUser
  refreshToken: string
  token: string
  infos: {
    isAdmin: boolean
  }
}

@injectable()
export class CreateSessionUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly userRepository: IUsersRepository,

    @inject(InjectableDependencies.Repositories.RefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @inject(InjectableDependencies.Providers.DateProvider)
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute({
    email,
    password,
    verifyIsAdmin = false,
    onApplication,
  }: IRequest): Promise<IResolve<IResponse>> {
    const {
      expiresInToken,
      secretToken,
      secretRefreshToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
    } = session

    const userExiste = await this.userRepository.findByEmail(email)
    if (!userExiste) {
      return {
        ok: false,
        error: makeErrorUserInvalidCredentialsToLogin(),
      }
    }

    const passwordCorrect = compareSync(password, userExiste.password)
    if (!passwordCorrect) {
      return {
        ok: false,
        error: makeErrorUserInvalidCredentialsToLogin(),
      }
    }

    if (verifyIsAdmin && !userExiste.admin) {
      return {
        ok: false,
        error: makeErrorAccessDenied(),
      }
    }

    const token = sign(
      {
        admin: userExiste.admin,
        name: userExiste.username,
        email: userExiste.email,
      },
      secretToken,
      {
        subject: userExiste.id,
        expiresIn: expiresInToken,
      },
    )

    const refreshToken = sign(
      {
        admin: userExiste.admin,
        name: userExiste.username,
        email: userExiste.email,
      },
      secretRefreshToken,
      {
        subject: userExiste.id,
        expiresIn: expiresInRefreshToken,
      },
    )

    const expiresDate = this.dateProvider.addDays(
      Number(expiresRefreshTokenDays),
    )

    await this.refreshTokenRepository.deletePerUserAndApplication(
      userExiste.id,
      onApplication,
    )

    await this.refreshTokenRepository.create({
      expires_date: expiresDate,
      refresh_token: refreshToken,
      user_id: userExiste.id,
      application: onApplication,
    })

    return {
      ok: true,
      data: {
        user: userExiste,
        refreshToken,
        token,
        infos: {
          isAdmin: verifyIsAdmin ? userExiste.admin : false,
        },
      },
    }
  }
}
