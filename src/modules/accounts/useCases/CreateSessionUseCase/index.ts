import { compareSync } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import session from '@config/session'
import { IRefreshTokenRepository } from '@modules/accounts/infra/repositories/contracts/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUserPreview } from '@modules/accounts/responses/IUserPreview'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserInvalidCredentialsToLogin } from '@shared/errors/users/makeErrorUserInvalidCredentialsToLogin'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: IUserPreview
  refreshToken: string
  token: string
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

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const {
      expiresInToken,
      secretToken,
      secretRefreshToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
    } = session

    const userExiste = await this.userRepository.findByEmail(email)
    if (!userExiste) throw makeErrorUserInvalidCredentialsToLogin()

    const passwordCorrect = compareSync(password, userExiste.password)
    if (!passwordCorrect) throw makeErrorUserInvalidCredentialsToLogin()

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

    await this.refreshTokenRepository.deletePerUserId(userExiste.id)

    await this.refreshTokenRepository.create({
      expires_date: expiresDate,
      refresh_token: refreshToken,
      user_id: userExiste.id,
    })

    return {
      user: {
        id: userExiste.id,
        username: userExiste.username,
        email: userExiste.email,
        avatar_url: userExiste.avatar_url,
        notifications: userExiste.notifications ?? [],
        new_notifications: userExiste.new_notifications,
      },
      refreshToken,
      token,
    }
  }
}
