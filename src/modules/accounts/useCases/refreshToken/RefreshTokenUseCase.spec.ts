/* eslint-disable import/no-unresolved */
import { verify } from 'jsonwebtoken'

import session from '@config/session'
import { RefreshTokenRepositoryInMemory } from '@modules/accounts/repositories/inMemory/RefreshTokenRepositoryInMemory'
import { UserRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UserRepositoryInMemory'
import { IRefreshTokenRepository } from '@modules/accounts/repositories/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { DayJsDateProvider } from '@shared/container/provides/DateProvider/implementations/DayJsDateProvider'

import { CreateSessionUseCase } from '../createSession/CreateSessionUseCase'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { RefreshTokenUseCase } from './RefreshTokenUseCase'

let refreshTokenUseCase: RefreshTokenUseCase
let refreshTokenRepository: IRefreshTokenRepository
let dateProvider: IDateProvider
let usersRepository: IUsersRepository
let createSessionUseCase: CreateSessionUseCase
let createUserUseCase: CreateUserUseCase

interface IPayload {
  sub: string
}

describe('refresh token', () => {
  beforeEach(() => {
    dateProvider = new DayJsDateProvider()
    refreshTokenRepository = new RefreshTokenRepositoryInMemory()
    usersRepository = new UserRepositoryInMemory()
    createUserUseCase = new CreateUserUseCase(usersRepository)
    createSessionUseCase = new CreateSessionUseCase(
      usersRepository,
      refreshTokenRepository,
      dateProvider,
    )
    refreshTokenUseCase = new RefreshTokenUseCase(
      refreshTokenRepository,
      dateProvider,
      usersRepository,
    )
  })

  it('should be able to refresh the token', async () => {
    const user = await createUserUseCase.execute({
      age: '20',
      email: 'test@example.com',
      name: 'test',
      password: 'password',
      sex: 'male',
      username: 'test',
    })

    const { refreshToken } = await createSessionUseCase.execute({
      email: 'test@example.com',
      password: 'password',
    })

    const { token } = await refreshTokenUseCase.execute(refreshToken)

    const { sub: userId } = verify(token, session.secretToken) as IPayload

    expect(userId).toEqual(user.id)
  })
})
