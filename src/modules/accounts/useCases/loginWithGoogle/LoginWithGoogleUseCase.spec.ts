import 'reflect-metadata'

import { beforeEach, describe, expect, it } from 'vitest'

import { RefreshTokenRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/RefreshTokenRepositoryInMemory'
import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider'
import { AppError } from '@shared/errors/AppError'

import { LoginWithGoogleUseCase } from './LoginWithGoogleUseCase'

let userRepositoryInMemory: UserRepositoryInMemory
let refreshTokenRepositoryInMemory: RefreshTokenRepositoryInMemory

let dateProvider = new DayJsDateProvider()

let loginWithGoogleUseCase: LoginWithGoogleUseCase

describe('Login with Google', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    refreshTokenRepositoryInMemory = new RefreshTokenRepositoryInMemory()

    dateProvider = new DayJsDateProvider()

    loginWithGoogleUseCase = new LoginWithGoogleUseCase(
      userRepositoryInMemory,
      refreshTokenRepositoryInMemory,
      dateProvider,
    )
  })

  it('Should be able to login in application using Google', async () => {
    const newSession = await loginWithGoogleUseCase.execute({
      email: 'teste@teste',
      image: undefined,
      name: 'test',
    })

    expect(newSession).toHaveProperty('user')
    expect(newSession).toHaveProperty('token')
    expect(newSession).toHaveProperty('refreshToken')
    expect(newSession.user.isSocialLogin).toEqual(true)
  })

  it('not should be able to login in application using Google if account is not social login', async () => {
    expect(async () => {
      await userRepositoryInMemory.create({
        name: 'test',
        age: 'test',
        email: 'test@teste',
        password: 'test',
        sex: 'test',
        username: 'test',
        isSocialLogin: false,
      })

      await loginWithGoogleUseCase.execute({
        email: 'test@teste',
        image: undefined,
        name: 'test',
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
