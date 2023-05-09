import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { UserRepositoryInMemory } from '@modules/accounts/infra/repositories/inMemory/UserRepositoryInMemory'
import { type IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { ProjectsRepositoryInMemory } from '@modules/projects/infra/repositories/inMemory/ProjectsRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'
import { createFakeUser } from '@utils/tests/users/createFakeUser'

import { CreateUserUseCase } from '.'

let createUserUseCase: CreateUserUseCase
let userRepositoryInMemory: IUsersRepository
let projectRepositoryInMemory: IProjectsRepository

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
    const newUserTest = createFakeUser()
    await createUserUseCase.execute(newUserTest)

    const userCreated = await userRepositoryInMemory.findByEmail(
      newUserTest.email,
    )
    if (!userCreated) throw new Error()

    expect(userCreated).toHaveProperty('id')
    expect(userCreated.password).not.toEqual('test123')
  })

  it('Should not be able to create a new user with email exits', async () => {
    expect(async () => {
      const newUserTest = createFakeUser()

      await createUserUseCase.execute(newUserTest)
      await createUserUseCase.execute(newUserTest)
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
