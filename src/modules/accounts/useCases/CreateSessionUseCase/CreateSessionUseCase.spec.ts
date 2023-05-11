import 'reflect-metadata'
import { hashSync } from 'bcryptjs'
import { describe, beforeEach, it, expect } from 'vitest'

import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { type IRefreshTokenRepository } from '@modules/accounts/infra/repositories/contracts/IRefreshTokenRepository'
import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { RefreshTokenRepositoryInMemory } from '@modules/accounts/infra/repositories/inMemory/RefreshTokenRepositoryInMemory'
import { UserRepositoryInMemory } from '@modules/accounts/infra/repositories/inMemory/UserRepositoryInMemory'
import { type IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider'
import { AppError } from '@shared/errors/AppError'

import { CreateSessionUseCase } from '.'

let createSessionUseCase: CreateSessionUseCase
let userRepositoryInMemory: IUsersRepository
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
    expect(session.user).not.toHaveProperty('password')
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
        password: hashSync('test123', 8),
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

  it('Should not be able to create session on more than one device', async () => {
    const newUserTest: ICreateUserDTO = {
      name: 'Unitary test to create user',
      email: 'test@user.com',
      age: '18',
      password: hashSync('test123', 8),
      sex: 'test',
      username: 'Test to create user',
    }

    const userCreated = await userRepositoryInMemory.create(newUserTest)
    if (!userCreated) throw new Error()

    await createSessionUseCase.execute({
      email: 'test@user.com',
      password: 'test123',
    })

    await createSessionUseCase.execute({
      email: 'test@user.com',
      password: 'test123',
    })

    const refreshTokens = await refreshTokenRepository.findByUserId(
      userCreated.id,
    )

    expect(refreshTokens.length).toEqual(1)
  })
})
