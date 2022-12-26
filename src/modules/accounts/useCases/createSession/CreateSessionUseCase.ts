/* eslint-disable import/no-unresolved */
import { compareSync } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import session from '@config/session'
import { IRefreshTokenRepository } from '@modules/accounts/repositories/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: {
    id: string
    username: string
    email: string
    avatar: string
    admin: boolean
    age: string
    isInitialized: boolean
    sex: string
  }
  refreshToken: string
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

  async execute(request: IRequest): Promise<IResponse> {
    const { email, password } = request
    const {
      // expiresInToken,
      // secretToken,
      secretRefreshToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
    } = session

    const userExiste = await this.userRepository.findByEmail(email)

    if (!userExiste) {
      throw new AppError('Email or password incorrect!')
    }

    const passwordCorrect = compareSync(password, userExiste.password)

    if (!passwordCorrect) {
      throw new AppError('Email or password incorrect!')
    }

    // const token = sign(
    //   {
    //     admin: userExiste.admin,
    //     isInitialized: userExiste.isInitialized,
    //     name: userExiste.username,
    //     email: userExiste.email,
    //   },
    //   secretToken,
    //   {
    //     subject: userExiste.id,
    //     expiresIn: expiresInToken,
    //   },
    // )

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

    const expiresDate = this.dateProvider
      .addDays(expiresRefreshTokenDays)
      .toString()

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
        admin: userExiste.admin,
        age: userExiste.age,
        isInitialized: userExiste.isInitialized,
        sex: userExiste.sex,
      },
      refreshToken,
    }
  }
}
