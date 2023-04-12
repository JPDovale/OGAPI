import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { UserRepositoryInMemory } from '@modules/accounts/infra/repositories/inMemory/UserRepositoryInMemory'
import { FirebaseStorageProvider } from '@shared/container/providers/StorageProvider/implementations/FirebaseStorageProvider'
import { type IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'

import { DeleteUserUseCase } from '.'

let deleteUserUseCase: DeleteUserUseCase

let userRepositoryInMemory: IUsersRepository
let storageProvider: IStorageProvider

describe('Delete user test', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    storageProvider = new FirebaseStorageProvider()

    deleteUserUseCase = new DeleteUserUseCase(
      userRepositoryInMemory,
      storageProvider,
    )
  })

  it('Should be abele delete user', async () => {
    const newUserTest: ICreateUserDTO = {
      name: 'Unitary test to delete user',
      email: 'test@test.com',
      age: '18',
      password: 'test123',
      sex: 'test',
      username: 'Test to delete user',
    }

    const newUserTest2: ICreateUserDTO = {
      name: 'Unitary test to delete user',
      email: 'test2@test2.com',
      age: '18',
      password: 'test123',
      sex: 'test',
      username: 'Test to delete user',
    }

    const user = await userRepositoryInMemory.create(newUserTest)
    await userRepositoryInMemory.create(newUserTest2)
    if (!user) throw new Error()

    await deleteUserUseCase.execute({ userId: user.id })
    const allUsers = await userRepositoryInMemory.list()

    expect(allUsers.length).toEqual(1)
  })
})
