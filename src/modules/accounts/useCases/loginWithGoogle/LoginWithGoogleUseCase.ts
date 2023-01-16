import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import session from '@config/session'
import { IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { IRefreshTokenRepository } from '@modules/accounts/repositories/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { AppError } from '@shared/errors/AppError'

interface IResponse {
  user: IUserInfosResponse
  refreshToken: string
  token: string
}

@injectable()
export class LoginWithGoogleUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute(
    email: string,
    image: string,
    name: string,
  ): Promise<IResponse> {
    const {
      expiresInToken,
      secretToken,
      secretRefreshToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
    } = session

    const userExiste = await this.usersRepository.findByEmail(email)

    if (userExiste) {
      const isSocialLogin = userExiste.isSocialLogin

      if (!isSocialLogin) {
        throw new AppError({
          title: 'Login recusado.',
          message:
            'Você criou uma conta com esse email anteriormente. Para acessar fornaça email e senha nos campos abaixo',
        })
      }

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
        this.dateProvider.addDays(expiresRefreshTokenDays),
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
          isSocialLogin: userExiste.isSocialLogin,
          isInitialized: userExiste.isInitialized,
          name: userExiste.name,
        },
        refreshToken,
        token,
      }
    }

    const newUser: IUserMongo = {
      age: 'uncharacterized',
      email,
      name,
      password: undefined,
      sex: 'uncharacterized',
      username: name,
      isSocialLogin: true,
      avatar: {
        fileName: '',
        url: image,
      },
    }

    const useCreated = await this.usersRepository.create(newUser)

    const token = sign(
      {
        admin: useCreated.admin,
        isInitialized: useCreated.isInitialized,
        name: useCreated.username,
        email: useCreated.email,
      },
      secretToken,
      {
        subject: useCreated.id,
        expiresIn: expiresInToken,
      },
    )

    const refreshToken = sign(
      {
        admin: useCreated.admin,
        name: useCreated.username,
        email: useCreated.email,
      },
      secretRefreshToken,
      {
        subject: useCreated.id,
        expiresIn: expiresInRefreshToken,
      },
    )

    const expiresDate = this.dateProvider.getDate(
      this.dateProvider.addDays(expiresRefreshTokenDays),
    )

    await this.refreshTokenRepository.create({
      expiresDate,
      refreshToken,
      userId: useCreated.id,
    })

    return {
      user: {
        id: useCreated.id,
        username: useCreated.username,
        email: useCreated.email,
        avatar: useCreated.avatar,
        age: useCreated.age,
        sex: useCreated.sex,
        createAt: useCreated.createAt,
        updateAt: useCreated.updateAt,
        notifications: useCreated.notifications,
        isInitialized: useCreated.isInitialized,
        isSocialLogin: useCreated.isSocialLogin,
        name: useCreated.name,
      },
      refreshToken,
      token,
    }
  }
}
