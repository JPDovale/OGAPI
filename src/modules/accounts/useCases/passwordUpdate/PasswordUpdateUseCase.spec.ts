import { UserRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UserRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'

import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { PasswordUpdateUseCase } from './PasswordUpdateUseCase'

let userRepositoryImMemory: UserRepositoryInMemory

let createUserUseCase: CreateUserUseCase
let passwordUpdateUseCase: PasswordUpdateUseCase

describe('Update Password', () => {
  beforeEach(() => {
    userRepositoryImMemory = new UserRepositoryInMemory()

    createUserUseCase = new CreateUserUseCase(userRepositoryImMemory)
    passwordUpdateUseCase = new PasswordUpdateUseCase(userRepositoryImMemory)
  })

  it('Should be able update password', async () => {
    const newUser = await createUserUseCase.execute({
      email: 'test@example.com',
      name: 'test',
      password: 'password',
    })

    await passwordUpdateUseCase.execute(newUser.id, 'password', 'password2')

    const updatedUser = await userRepositoryImMemory.findById(newUser.id)

    expect(newUser.password).not.toEqual(updatedUser.password)
  })

  it('Not should be able update password with wrong old password', async () => {
    expect(async () => {
      const newUser = await createUserUseCase.execute({
        email: 'test@example.com',
        name: 'test',
        password: 'password',
      })

      await passwordUpdateUseCase.execute(newUser.id, 'password2', 'password3')
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })

  it('Not should be able update password for not existe user', async () => {
    expect(async () => {
      await passwordUpdateUseCase.execute('1231231', 'password2', 'password3')
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
