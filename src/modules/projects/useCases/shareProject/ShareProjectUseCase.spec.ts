import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { AppError } from '@shared/errors/AppError'

import { ShareProjectUseCase } from './ShareProjectUseCase'

let usersRepositoryInMemory: IUsersRepository
let projectsRepositoryInMemory: IProjectsRepository

let shareProjectUseCase: ShareProjectUseCase

describe('Share project', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UserRepositoryInMemory()
    projectsRepositoryInMemory = new ProjectsRepositoryInMemory()

    shareProjectUseCase = new ShareProjectUseCase(
      usersRepositoryInMemory,
      projectsRepositoryInMemory,
    )
  })

  it('should be able to share project', async () => {
    const user = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
    })

    const userToAddOnProject = await usersRepositoryInMemory.create({
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

    await shareProjectUseCase.execute(
      {
        email: 'testUserToAdd@test.com',
        permission: 'edit',
      },
      newProjectTest.id,
      user.id,
    )

    const projectWithNewUser = await projectsRepositoryInMemory.findById(
      newProjectTest.id,
    )
    const userAddedOnProject = projectWithNewUser.users.find(
      (user) => user.id === userToAddOnProject.id,
    )

    expect(projectWithNewUser.users.length).toEqual(2)
    expect(userAddedOnProject.permission).toEqual('edit')
    expect(userAddedOnProject.email).toEqual('testUserToAdd@test.com')
    expect(userAddedOnProject.id).toEqual(userToAddOnProject.id)
  })

  it('not should be able share project if user not creator', async () => {
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

      const userToAddOnProject = await usersRepositoryInMemory.create({
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
          {
            email: user2.email,
            id: user2.id,
            permission: 'edit',
          },
        ],
        plot: {},
      })

      await shareProjectUseCase.execute(
        {
          email: 'testUserToAdd@test.com' || userToAddOnProject.email, // desativar error de variável não usada //
          permission: 'edit',
        },
        newProjectTest.id,
        user2.id,
      )
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })

  it('not should be able share project if users on project excede max of 5', async () => {
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

      const userToAddOnProject = await usersRepositoryInMemory.create({
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
          {
            email: user2.email,
            id: user2.id,
            permission: 'edit',
          },
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
            email: user.email,
            id: user.id,
            permission: 'edit',
          },
        ],
        plot: {},
      })

      await shareProjectUseCase.execute(
        {
          email: 'testUserToAdd@test.com' || userToAddOnProject.email, // desativar error de variável não usada //
          permission: 'edit',
        },
        newProjectTest.id,
        user.id,
      )
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })

  it('not should be able share project if user already on project', async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        age: '2312',
        email: 'test@test.com',
        name: 'test',
        password: 'test',
        sex: 'male',
        username: 'test',
      })

      const userToAddOnProject = await usersRepositoryInMemory.create({
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
          {
            email: userToAddOnProject.email,
            id: userToAddOnProject.id,
            permission: 'edit',
          },
        ],
        plot: {},
      })

      await shareProjectUseCase.execute(
        {
          email: 'testUserToAdd@test.com',
          permission: 'edit',
        },
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

    const userToAddOnProject = await usersRepositoryInMemory.create({
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

    await shareProjectUseCase.execute(
      {
        email: 'testUserToAdd@test.com',
        permission: 'edit',
      },
      newProjectTest.id,
      user.id,
    )

    const userToAddOnProjectNotified = await usersRepositoryInMemory.findById(
      userToAddOnProject.id,
    )

    expect(userToAddOnProjectNotified.notifications.length).toEqual(1)
  })
})
