/* eslint-disable import/no-unresolved */
import { sign, verify } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import session from '@config/session'
import { IRefreshTokenRepository } from '@modules/accounts/infra/repositories/contracts/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUserEssentialInfos } from '@modules/accounts/infra/repositories/entities/IUserEssentialInfos'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { KeysRedis } from '@shared/container/providers/CacheProvider/types/Keys'
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

    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute({ token }: IRequest): Promise<IResponse> {
    const { sub: userId } = verify(
      token,
      session.secretRefreshToken,
    ) as IPayload

    let userEssentialInfos: IUserEssentialInfos | null

    userEssentialInfos = await this.cacheProvider.getInfo<IUserEssentialInfos>(
      KeysRedis.userEssentialInfos + userId,
    )

    if (!userEssentialInfos) {
      const userExiste = await this.userRepository.findById(userId)
      if (!userExiste) throw makeErrorUserNotFound()

      await this.cacheProvider.setInfo<IUserEssentialInfos>(
        KeysRedis.userEssentialInfos + userId,
        {
          admin: userExiste.admin,
          email: userExiste.email,
          id: userExiste.id,
          name: userExiste.name,
        },
        KeysRedis.userEssentialInfosExpires, // 3days
      )

      userEssentialInfos = {
        admin: userExiste.admin,
        email: userExiste.email,
        id: userExiste.id,
        name: userExiste.name,
      }
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
