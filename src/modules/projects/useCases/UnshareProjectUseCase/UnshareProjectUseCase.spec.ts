import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'

import { UnshareProjectUseCase } from './UnshareProjectUseCase'

let usersRepositoryInMemory: IUsersRepository
let projectsRepositoryInMemory: IProjectsRepository

let unshareProjectUseCase: UnshareProjectUseCase

describe('Unshare project', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UserRepositoryInMemory()
    projectsRepositoryInMemory = new ProjectsRepositoryInMemory()

    unshareProjectUseCase = new UnshareProjectUseCase(
      usersRepositoryInMemory,
      projectsRepositoryInMemory,
    )
  })

  it('should be able to unshare project', async () => {
    const user = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
    })

    const userToRemoveOnProject = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'testUserToRemove@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
    })

    const newProjectTest = await projectsRepositoryInMemory.create({
      name: 'test',
      private: false,
      type: 'book',
      createdPerUser: user.id,
      users: [
        {
          email: user.email,
          id: user.id,
          permission: 'edit',
        },
        {
          email: userToRemoveOnProject.email,
          id: userToRemoveOnProject.id,
          permission: 'edit',
        },
      ],
      plot: {},
    })

    await unshareProjectUseCase.execute(
      'testUserToRemove@test.com',

      newProjectTest.id,
      user.id,
    )

    const projectWithUserDeleted = await projectsRepositoryInMemory.findById(
      newProjectTest.id,
    )

    expect(projectWithUserDeleted.users.length).toEqual(1)
  })

  it('not should be able unshare project if user not creator', async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        age: '2312',
        email: 'test@test.com',
        name: 'test',
        password: 'test',
        sex: 'male',
        username: 'test',
      })

      const user2 = await usersRepositoryInMemory.create({
        age: '2312',
        email: 'test2@test2.com',
        name: 'test2',
        password: 'test2',
        sex: 'male',
        username: 'test2',
      })

      const userToRemoveOnProject = await usersRepositoryInMemory.create({
        age: '2312',
        email: 'testUserToRemove@test.com',
        name: 'test',
        password: 'test',
        sex: 'male',
        username: 'test',
      })

      const newProjectTest = await projectsRepositoryInMemory.create({
        name: 'test',
        private: false,
        type: 'book',
        createdPerUser: user.id,
        users: [
          {
            email: user.email,
            id: user.id,
            permission: 'edit',
          },
          {
            email: user2.email,
            id: user2.id,
            permission: 'edit',
          },
          {
            email: userToRemoveOnProject.email,
            id: userToRemoveOnProject.id,
            permission: 'edit',
          },
        ],
        plot: {},
      })

      await unshareProjectUseCase.execute(
        'testUserToRemove@test.com',

        newProjectTest.id,
        user2.id,
      )
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })

  it('not should be able unshare project if user not already on project', async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        age: '2312',
        email: 'test@test.com',
        name: 'test',
        password: 'test',
        sex: 'male',
        username: 'test',
      })

      const userToRemoveOnProject = await usersRepositoryInMemory.create({
        age: '2312',
        email: 'testUserToAdd@test.com',
        name: 'test',
        password: 'test',
        sex: 'male',
        username: 'test',
      })

      const newProjectTest = await projectsRepositoryInMemory.create({
        name: 'test',
        private: false,
        type: 'book',
        createdPerUser: user.id,
        users: [
          {
            email: user.email,
            id: user.id,
            permission: 'edit',
          },
        ],
        plot: {},
      })

      await unshareProjectUseCase.execute(
        'testUserToRemove@test.com' ?? userToRemoveOnProject.email, // desativar error de variável não usada //,
        newProjectTest.id,
        user.id,
      )
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })

  it('should be able automatically notification user whit added on project', async () => {
    const user = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
    })

    const userToRemoveOnProject = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'testUserToRemove@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
    })

    const newProjectTest = await projectsRepositoryInMemory.create({
      name: 'test',
      private: false,
      type: 'book',
      createdPerUser: user.id,
      users: [
        {
          email: user.email,
          id: user.id,
          permission: 'edit',
        },
        {
          email: userToRemoveOnProject.email,
          id: userToRemoveOnProject.id,
          permission: 'edit',
        },
      ],
      plot: {},
    })

    await unshareProjectUseCase.execute(
      'testUserToRemove@test.com',

      newProjectTest.id,
      user.id,
    )

    const userToRemoveOnProjectNotified =
      await usersRepositoryInMemory.findById(userToRemoveOnProject.id)

    expect(userToRemoveOnProjectNotified.notifications.length).toEqual(1)
  })
})
