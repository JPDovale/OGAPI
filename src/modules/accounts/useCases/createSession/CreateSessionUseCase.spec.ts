import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { UserRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UserRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'

import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { CreateSessionUseCase } from './CreateSessionUseCase'

let createSessionUseCase: CreateSessionUseCase
let userRepositoryInMemory: UserRepositoryInMemory
let createUserUseCase: CreateUserUseCase

describe('Create session fou user', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    createSessionUseCase = new CreateSessionUseCase(userRepositoryInMemory)
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

    expect(session).toHaveProperty('token')
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
