import { RefreshTokenRepositoryInMemory } from '@modules/accounts/repositories/inMemory/RefreshTokenRepositoryInMemory'
import { UserRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UserRepositoryInMemory'
import { DayJsDateProvider } from '@shared/container/provides/DateProvider/implementations/DayJsDateProvider'

import { CreateSessionUseCase } from '../createSession/CreateSessionUseCase'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { LogoutUseCase } from './LogoutUseCase'

let refreshTokenRepositoryInMemory: RefreshTokenRepositoryInMemory
let userRepositoryInMemory: UserRepositoryInMemory

let dateProvider: DayJsDateProvider

let createUserUseCase: CreateUserUseCase
let createSessionUseCase: CreateSessionUseCase
let logoutUseCase: LogoutUseCase

describe('Logout', () => {
  beforeEach(() => {
    refreshTokenRepositoryInMemory = new RefreshTokenRepositoryInMemory()
    userRepositoryInMemory = new UserRepositoryInMemory()

    dateProvider = new DayJsDateProvider()

    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    createSessionUseCase = new CreateSessionUseCase(
      userRepositoryInMemory,
      refreshTokenRepositoryInMemory,
      dateProvider,
    )
    logoutUseCase = new LogoutUseCase(refreshTokenRepositoryInMemory)
  })

  it('Should be able logout', async () => {
    const newUserTest = await createUserUseCase.execute({
      email: 'test@example',
      password: 'test',
      name: 'test',
    })

    await createSessionUseCase.execute({
      email: 'test@example',
      password: 'test',
    })

    await logoutUseCase.execute(newUserTest.id)

    const refreshTokens = await refreshTokenRepositoryInMemory.findByUserId(
      newUserTest.id,
    )

    expect(refreshTokens.length).toEqual(0)
  })
})
