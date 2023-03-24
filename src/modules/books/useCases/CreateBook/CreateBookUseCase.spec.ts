import 'reflect-metadata'

import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { type IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { type IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { BooksRepositoryInMemory } from '@modules/books/infra/mongoose/repositories/inMemory/booksRepositoryInMemory'
import { type IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { BoxesRepositoryInMemory } from '@modules/boxes/infra/mongoose/repositories/inMemory/BoxesRepositoryInMemory'
import { type ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { type IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { type ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { RedisCacheProvider } from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider'
import { type IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider'
import { NotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/implementations/NotifyUsersProvider'
import { type INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { type IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { BoxesControllers } from '@shared/container/services/boxesControllers/implementations/BoxesControllers'
import { VerifyPermissions } from '@shared/container/services/verifyPermissions/implementations/VerifyPermissions'
import { type IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

import { CreateBookUseCase } from './CreateBookUseCase'

let usersRepositoryInMemory: IUsersRepository
let booksRepositoryInMemory: IBooksRepository
let projectsRepositoryInMemory: IProjectsRepository
let boxesRepositoryInMemory: IBoxesRepository

let dateProvider: IDateProvider
let cacheProvider: ICacheProvider
let notifyUsersProvider: INotifyUsersProvider

let verifyPermissionsService: IVerifyPermissionsService
let boxesControllers: IBoxesControllers

let createBookUseCase: CreateBookUseCase

describe('Create book', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UserRepositoryInMemory()
    booksRepositoryInMemory = new BooksRepositoryInMemory()
    projectsRepositoryInMemory = new ProjectsRepositoryInMemory()
    boxesRepositoryInMemory = new BoxesRepositoryInMemory()

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
    boxesControllers = new BoxesControllers(
      boxesRepositoryInMemory,
      dateProvider,
    )

    createBookUseCase = new CreateBookUseCase(
      booksRepositoryInMemory,
      notifyUsersProvider,
      verifyPermissionsService,
      boxesControllers,
      boxesRepositoryInMemory,
      dateProvider,
    )
  })

  it('Should be able to create book in project', async () => {
    const user = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
    })

    const newProjectTest: ICreateProjectDTO = {
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
    }

    await projectsRepositoryInMemory.create(newProjectTest)
    const newProject = await projectsRepositoryInMemory.create(newProjectTest)

    await createBookUseCase.execute({
      authors: [{ email: user.email, id: user.id, username: user.username }],
      generes: [{ name: 'teste' }],
      isbn: 'undefine',
      literaryGenere: 'teste',
      projectId: newProject.id,
      subtitle: 'test',
      title: 'teste',
      userId: user.id,
    })

    const books = await booksRepositoryInMemory.listPerUser(user.id)

    expect(books.length).toEqual(1)
  })

  it('Should be able to create box to book in project', async () => {
    const user = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
    })

    const newProjectTest: ICreateProjectDTO = {
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
    }

    await projectsRepositoryInMemory.create(newProjectTest)
    const newProject = await projectsRepositoryInMemory.create(newProjectTest)

    await createBookUseCase.execute({
      authors: [{ email: user.email, id: user.id, username: user.username }],
      generes: [{ name: 'teste' }],
      isbn: 'undefine',
      literaryGenere: 'teste',
      projectId: newProject.id,
      subtitle: 'test',
      title: 'teste',
      userId: user.id,
    })

    const boxesThisUser = await boxesRepositoryInMemory.listPerUser(user.id)

    expect(boxesThisUser.length).toEqual(1)
  })

  it('Should be able to update box to book in project if another books already created', async () => {
    const user = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
    })

    const newProjectTest: ICreateProjectDTO = {
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
    }

    await projectsRepositoryInMemory.create(newProjectTest)
    const newProject = await projectsRepositoryInMemory.create(newProjectTest)

    await createBookUseCase.execute({
      authors: [{ email: user.email, id: user.id, username: user.username }],
      generes: [{ name: 'teste' }],
      isbn: 'undefine',
      literaryGenere: 'teste',
      projectId: newProject.id,
      subtitle: 'test',
      title: 'teste',
      userId: user.id,
    })

    await createBookUseCase.execute({
      authors: [{ email: user.email, id: user.id, username: user.username }],
      generes: [{ name: 'teste' }],
      isbn: 'undefine',
      literaryGenere: 'teste',
      projectId: newProject.id,
      subtitle: 'test2',
      title: 'teste2',
      userId: user.id,
    })

    const boxesThisUser = await boxesRepositoryInMemory.listPerUser(user.id)

    expect(boxesThisUser[0].archives[0].links.length).toEqual(2)
    expect(boxesThisUser[0].archives.length).toEqual(1)
  })

  it('Should be able to notify users on project about new book', async () => {
    const user = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
    })

    const userToNotify = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'userToNotify@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
    })

    const newProjectTest: ICreateProjectDTO = {
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
          email: userToNotify.email,
          id: userToNotify.id,
          permission: 'edit',
        },
      ],
      plot: {},
    }

    await projectsRepositoryInMemory.create(newProjectTest)
    const newProject = await projectsRepositoryInMemory.create(newProjectTest)

    await createBookUseCase.execute({
      authors: [{ email: user.email, id: user.id, username: user.username }],
      generes: [{ name: 'teste' }],
      isbn: 'undefine',
      literaryGenere: 'teste',
      projectId: newProject.id,
      subtitle: 'test',
      title: 'teste',
      userId: user.id,
    })

    const userNotified = await usersRepositoryInMemory.findById(userToNotify.id)

    expect(userNotified.notifications.length).toEqual(1)
  })

  it("not should be able to create book if user doesn't not permission", async () => {
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
        email: 'user2@test.com',
        name: 'test',
        password: 'test',
        sex: 'male',
        username: 'test',
      })

      const newProjectTest: ICreateProjectDTO = {
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
            permission: 'view',
          },
        ],
        plot: {},
      }

      await projectsRepositoryInMemory.create(newProjectTest)
      const newProject = await projectsRepositoryInMemory.create(newProjectTest)

      await createBookUseCase.execute({
        authors: [{ email: user.email, id: user.id, username: user.username }],
        generes: [{ name: 'teste' }],
        isbn: 'undefine',
        literaryGenere: 'teste',
        projectId: newProject.id,
        subtitle: 'test',
        title: 'teste',
        userId: user2.id,
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
