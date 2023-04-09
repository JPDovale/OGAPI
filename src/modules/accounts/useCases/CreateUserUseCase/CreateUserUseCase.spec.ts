import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'

import { CreateUserUseCase } from './CreateUserUseCase'

let createUserUseCase: CreateUserUseCase
let userRepositoryInMemory: UserRepositoryInMemory
let projectRepositoryInMemory: ProjectsRepositoryInMemory

describe('Create user', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    projectRepositoryInMemory = new ProjectsRepositoryInMemory()
    createUserUseCase = new CreateUserUseCase(
      userRepositoryInMemory,
      projectRepositoryInMemory,
    )
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
    expect(userCreated.password).not.toEqual('test123')
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
