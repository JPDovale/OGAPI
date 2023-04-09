import 'reflect-metadata'

import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { PlotProject } from '@modules/projects/infra/mongoose/entities/Plot'
import { type IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { type ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { RedisCacheProvider } from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider'
import { type IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider'
import { NotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/implementations/NotifyUsersProvider'
import { type INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { VerifyPermissions } from '@shared/container/services/verifyPermissions/implementations/VerifyPermissions'
import { type IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

import { CommentInPlotProjectUseCase } from './CommentInPlotProjectUseCase'

let projectsRepositoryInMemory: IProjectsRepository
let usersRepositoryInMemory: IUsersRepository

let dateProvider: IDateProvider
let notifyUsersProvider: INotifyUsersProvider
let cacheProvider: ICacheProvider

let verifyPermissionsService: IVerifyPermissionsService

let commentInPlotProjectUseCase: CommentInPlotProjectUseCase

describe('Comment in plot', () => {
  beforeEach(() => {
    projectsRepositoryInMemory = new ProjectsRepositoryInMemory()
    usersRepositoryInMemory = new UserRepositoryInMemory()

    dateProvider = new DayJsDateProvider()
    cacheProvider = new RedisCacheProvider(dateProvider)
    notifyUsersProvider = new NotifyUsersProvider(
      usersRepositoryInMemory,
      cacheProvider,
    )

    verifyPermissionsService = new VerifyPermissions(
      projectsRepositoryInMemory,
      usersRepositoryInMemory,
    )

    commentInPlotProjectUseCase = new CommentInPlotProjectUseCase(
      projectsRepositoryInMemory,
      notifyUsersProvider,
      verifyPermissionsService,
    )
  })

  it('should be able to comment in plot project', async () => {
    const user = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
    })

    const userToComment = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'testUserComment@test.com',
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
          email: userToComment.email,
          id: userToComment.id,
          permission: 'comment',
        },
      ],
      plot: { ...new PlotProject({}) },
    })

    await commentInPlotProjectUseCase.execute(
      userToComment.id,
      newProjectTest.id,
      { content: 'test', to: 'onePhrase' },
    )

    const projectWhitComment = await projectsRepositoryInMemory.findById(
      newProjectTest.id,
    )

    expect(projectWhitComment.plot.comments.length).toEqual(1)
  })

  it('should be able automatically notify users on project about comment', async () => {
    const user = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
    })

    const userToComment = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'testUserComment@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
    })

    const user2 = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'test2@test2.com',
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
          email: userToComment.email,
          id: userToComment.id,
          permission: 'comment',
        },
        {
          email: user2.email,
          id: user2.id,
          permission: 'view',
        },
      ],
      plot: { ...new PlotProject({}) },
    })

    await commentInPlotProjectUseCase.execute(
      userToComment.id,
      newProjectTest.id,
      { content: 'test', to: 'onePhrase' },
    )

    const projectWhitComment = await projectsRepositoryInMemory.findById(
      newProjectTest.id,
    )
    const userWhitNotification = await usersRepositoryInMemory.findById(user.id)
    const user2WhitNotification = await usersRepositoryInMemory.findById(
      user2.id,
    )

    expect(projectWhitComment.plot.comments.length).toEqual(1)
    expect(userWhitNotification.notifications.length).toEqual(1)
    expect(user2WhitNotification.notifications.length).toEqual(1)
  })

  it("not should be able comment if user doesn't not permission", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        age: '2312',
        email: 'test@test.com',
        name: 'test',
        password: 'test',
        sex: 'male',
        username: 'test',
      })

      const userToComment = await usersRepositoryInMemory.create({
        age: '2312',
        email: 'testUserComment@test.com',
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
            email: userToComment.email,
            id: userToComment.id,
            permission: 'view',
          },
        ],
        plot: { ...new PlotProject({}) },
      })

      await commentInPlotProjectUseCase.execute(
        userToComment.id,
        newProjectTest.id,
        { content: 'test', to: 'onePhrase' },
      )
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
