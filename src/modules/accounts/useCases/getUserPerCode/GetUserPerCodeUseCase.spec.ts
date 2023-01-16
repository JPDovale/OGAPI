import { UserRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UserRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'

import { GetUserPerCodeUseCase } from './GetUserPerCodeUseCase'

let userRepositoryInMemory: UserRepositoryInMemory
let getUserPerCodeUseCase: GetUserPerCodeUseCase

describe('Get user per code to is initialized', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    getUserPerCodeUseCase = new GetUserPerCodeUseCase(userRepositoryInMemory)
  })

  it('Should be able get user with one code', async () => {
    const newUserTest = {
      name: 'User with code',
      email: ' ',
      age: ' ',
      password: ' ',
      username: ' ',
      sex: 'test',
      code: '1212',
    }

    await userRepositoryInMemory.create(newUserTest)

    const newUserTestFromCodeGet = {
      name: 'new name',
      email: 'test@example.com',
      password: '11212121232123',
      username: 'test',
      age: '12',
      sex: 'test',
      isInitialized: true,
    }

    const user = await getUserPerCodeUseCase.execute(
      newUserTest.code,
      newUserTestFromCodeGet,
    )

    expect(user.code).toEqual(' ')
    expect(user.isInitialized).toEqual(true)
  })

  it('Not should be able get user with invalid code', async () => {
    expect(async () => {
      const newUserTestFromCodeGet = {
        name: 'new name',
        email: 'test@example.com',
        password: '11212121232123',
        username: 'test',
        age: '12',
        sex: 'test',
        isInitialized: true,
      }

      await getUserPerCodeUseCase.execute('213123123', newUserTestFromCodeGet)
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })

  it('Not should be able get user with email to used per another user', async () => {
    expect(async () => {
      const newUserTest = {
        name: 'User with code',
        email: ' ',
        age: ' ',
        password: ' ',
        username: ' ',
        sex: 'test',
        code: '1212',
      }

      await userRepositoryInMemory.create(newUserTest)

      const newUserTestSomeCode = {
        name: 'User',
        email: 'test@example.com',
        age: '12',
        password: '123',
        username: 'test',
        sex: 'test',
      }

      await userRepositoryInMemory.create(newUserTestSomeCode)

      const newUserTestFromCodeGet = {
        name: 'new name',
        email: 'test@example.com',
        password: '11212121232123',
        username: 'test',
        age: '12',
        sex: 'test',
        isInitialized: true,
      }

      await getUserPerCodeUseCase.execute('1212', newUserTestFromCodeGet)
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
