import { UserRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UserRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'

import { CreateUserUseCase } from './CreateUserUseCase'

let createUserUseCase: CreateUserUseCase
let userRepositoryInMemory: UserRepositoryInMemory

describe('Create user', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
  })

  it('Should be able to create a new user', async () => {
    const newUserTest = {
      name: 'Unitary test to create user',
      email: 'test@test.com',
      age: '18',
      password: 'test123',
      sex: 'test',
      username: 'Test to create user',
    }

    await createUserUseCase.execute(newUserTest)

    const userCreated = await userRepositoryInMemory.findByEmail(
      newUserTest.email,
    )

    expect(userCreated).toHaveProperty('id')
  })

  it('Should not be able to create a new user with email exits', async () => {
    expect(async () => {
      const newUserTest = {
        name: 'Unitary test to create user',
        email: 'test@test.com',
        age: '18',
        password: 'test123',
        sex: 'test',
        username: 'Test to create user',
      }

      await createUserUseCase.execute(newUserTest)

      await createUserUseCase.execute(newUserTest)
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
