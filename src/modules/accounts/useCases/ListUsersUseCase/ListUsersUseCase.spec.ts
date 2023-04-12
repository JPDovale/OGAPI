import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { UserRepositoryInMemory } from '@modules/accounts/infra/repositories/inMemory/UserRepositoryInMemory'

import { ListUsersUseCase } from '.'

let usersRepository: IUsersRepository
let listUsersUseCase: ListUsersUseCase

describe('list users', () => {
  beforeEach(() => {
    usersRepository = new UserRepositoryInMemory()
    listUsersUseCase = new ListUsersUseCase(usersRepository)
  })

  it('should be able list all users', async () => {
    await usersRepository.create({
      age: '20',
      email: 'test@example.com',
      name: 'test',
      password: 'password',
      sex: 'male',
      username: 'test',
    })

    await usersRepository.create({
      age: '20',
      email: 'test2@example.com',
      name: 'test',
      password: 'password',
      sex: 'male',
      username: 'test',
    })

    const { users } = await listUsersUseCase.execute()

    expect(users.length).toEqual(2)
  })
})
