import { compareSync } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import session from '@config/session'
import { IRefreshTokenRepository } from '@modules/accounts/infra/mongoose/repositories/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { type IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { makeErrorUserInvalidCredentialsToLogin } from '@shared/errors/users/makeErrorUserInvalidCredentialsToLogin'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: IUserInfosResponse
  refreshToken: string
  token: string
}

@injectable()
export class CreateSessionUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly userRepository: IUsersRepository,
    @inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @inject('DateProvider')
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
        isInitialized: userExiste.isInitialized,
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

    const expiresDate = this.dateProvider.getDate(
      this.dateProvider.addDays(Number(expiresRefreshTokenDays)),
    )

    await this.refreshTokenRepository.create({
      expiresDate,
      refreshToken,
      userId: userExiste.id,
    })

    return {
      user: {
        id: userExiste.id,
        username: userExiste.username,
        email: userExiste.email,
        avatar: userExiste.avatar,
        age: userExiste.age,
        sex: userExiste.sex,
        createAt: userExiste.createAt,
        updateAt: userExiste.updateAt,
        notifications: userExiste.notifications,
        isInitialized: userExiste.isInitialized,
        name: userExiste.name,
        isSocialLogin: userExiste.isSocialLogin,
      },
      refreshToken,
      token,
    }
  }
}
