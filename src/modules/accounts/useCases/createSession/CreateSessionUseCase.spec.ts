import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { RefreshTokenRepositoryInMemory } from '@modules/accounts/repositories/inMemory/RefreshTokenRepositoryInMemory'
import { UserRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UserRepositoryInMemory'
import { IRefreshTokenRepository } from '@modules/accounts/repositories/IRefreshTokenRepository'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { DayJsDateProvider } from '@shared/container/provides/DateProvider/implementations/DayJsDateProvider'
import { AppError } from '@shared/errors/AppError'

import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { CreateSessionUseCase } from './CreateSessionUseCase'

let createSessionUseCase: CreateSessionUseCase
let userRepositoryInMemory: UserRepositoryInMemory
let createUserUseCase: CreateUserUseCase
let refreshTokenRepository: IRefreshTokenRepository
let dateProvider: IDateProvider

describe('Create session fou user', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    refreshTokenRepository = new RefreshTokenRepositoryInMemory()
    dateProvider = new DayJsDateProvider()
    createSessionUseCase = new CreateSessionUseCase(
      userRepositoryInMemory,
      refreshTokenRepository,
      dateProvider,
    )
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
  })

  it('Should be able to create session an user', async () => {
    const newUserTest: ICreateUserDTO = {
      name: 'Unitary test to create user',
      email: 'test@test.com',
      age: '18',
      password: 'test123',
      sex: 'test',
      username: 'Test to create user',
    }

    await createUserUseCase.execute(newUserTest)

    const session = await createSessionUseCase.execute({
      email: newUserTest.email,
      password: newUserTest.password,
    })

    expect(session).toHaveProperty('refreshToken')
  })

  it('Should not be able to create session an none existent user', () => {
    expect(async () => {
      await createSessionUseCase.execute({
        email: 'notexist@no.com',
        password: 'false',
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })

  it('Should not be able to create session with incorrect password', () => {
    expect(async () => {
      const newUserTest: ICreateUserDTO = {
        name: 'Unitary test to create user',
        email: 'test@user.com',
        age: '18',
        password: 'test123',
        sex: 'test',
        username: 'Test to create user',
      }

      await createUserUseCase.execute(newUserTest)

      await createSessionUseCase.execute({
        email: newUserTest.email,
        password: 'invalid',
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
