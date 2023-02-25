import 'reflect-metadata'
import { hashSync } from 'bcryptjs'
import { describe, beforeEach, it, expect } from 'vitest'

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { RefreshTokenRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/RefreshTokenRepositoryInMemory'
import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { IRefreshTokenRepository } from '@modules/accounts/infra/mongoose/repositories/IRefreshTokenRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider'
import { AppError } from '@shared/errors/AppError'

import { CreateSessionUseCase } from './CreateSessionUseCase'

let createSessionUseCase: CreateSessionUseCase
let userRepositoryInMemory: UserRepositoryInMemory
let refreshTokenRepository: IRefreshTokenRepository
let dateProvider: IDateProvider

describe('Create session for user', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    refreshTokenRepository = new RefreshTokenRepositoryInMemory()
    dateProvider = new DayJsDateProvider()

    createSessionUseCase = new CreateSessionUseCase(
      userRepositoryInMemory,
      refreshTokenRepository,
      dateProvider,
    )
  })

  it('Should be able to create session an user', async () => {
    const newUserTest: ICreateUserDTO = {
      name: 'Unitary test to create session',
      email: 'test@test.com',
      age: '18',
      password: hashSync('test123', 8),
      sex: 'test',
      username: 'Test to create session',
    }

    await userRepositoryInMemory.create(newUserTest)

    const session = await createSessionUseCase.execute({
      email: 'test@test.com',
      password: 'test123',
    })

    expect(session).toHaveProperty('refreshToken')
    expect(session).toHaveProperty('token')
    expect(session).toHaveProperty('user')
    expect(session.user).not.toHaveProperty('admin')
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

      await userRepositoryInMemory.create(newUserTest)

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

  it('Should not be able to create session on more than one device', () => {
    expect(async () => {
      const newUserTest: ICreateUserDTO = {
        name: 'Unitary test to create user',
        email: 'test@user.com',
        age: '18',
        password: 'test123',
        sex: 'test',
        username: 'Test to create user',
      }

      const userCreated = await userRepositoryInMemory.create(newUserTest)

      await createSessionUseCase.execute({
        email: newUserTest.email,
        password: newUserTest.password,
      })

      await createSessionUseCase.execute({
        email: newUserTest.email,
        password: newUserTest.password,
      })

      const refreshTokens = await refreshTokenRepository.findByUserId(
        userCreated.id,
      )

      expect(refreshTokens.length).toEqual(1)
    })
  })
})
