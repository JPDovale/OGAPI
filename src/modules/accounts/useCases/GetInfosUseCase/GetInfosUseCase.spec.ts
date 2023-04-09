import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { type ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { RedisCacheProvider } from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider'
import { type IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider'
import { AppError } from '@shared/errors/AppError'

import { GetInfosUseCase } from './GetInfosUseCase'

let userRepositoryInMemory: UserRepositoryInMemory
let getInfosUseCase: GetInfosUseCase
let dateProvider: IDateProvider
let cacheProvider: ICacheProvider

describe('Get user infos', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    dateProvider = new DayJsDateProvider()
    cacheProvider = new RedisCacheProvider(dateProvider)
    getInfosUseCase = new GetInfosUseCase(userRepositoryInMemory, cacheProvider)
  })

  it('Should be able to get infos from one user', async () => {
    const newUserTest: ICreateUserDTO = {
      name: 'Unitary test to delete user',
      email: 'test@test.com',
      age: '18',
      password: 'test123',
      sex: 'test',
      username: 'Test to delete user',
    }

    const userCreated = await userRepositoryInMemory.create(newUserTest)

    const infosGet = await getInfosUseCase.execute(userCreated.id)

    expect(infosGet).toHaveProperty('id')
    expect(infosGet).toHaveProperty('email')
  })

  it('Not should be able to get infos from one user if he not existe', async () => {
    expect(async () => {
      await getInfosUseCase.execute('121212')
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
