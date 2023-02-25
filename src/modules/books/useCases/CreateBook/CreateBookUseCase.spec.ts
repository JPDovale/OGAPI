import 'reflect-metadata'

import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { BooksRepositoryInMemory } from '@modules/books/infra/mongoose/repositories/inMemory/booksRepositoryInMemory'
import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { RedisCacheProvider } from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider'
import { NotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/implementations/NotifyUsersProvider'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { VerifyPermissions } from '@shared/container/services/verifyPermissions/implementations/VerifyPermissions'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

import { CreateBookUseCase } from './CreateBookUseCase'

let usersRepositoryInMemory: IUsersRepository
let booksRepositoryInMemory: IBooksRepository
let projectsRepositoryInMemory: IProjectsRepository

let dateProvider: IDateProvider
let cacheProvider: ICacheProvider
let notifyUsersProvider: INotifyUsersProvider

let verifyPermissionsService: IVerifyPermissionsService

let createBookUseCase: CreateBookUseCase

describe('Create book', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UserRepositoryInMemory()
    booksRepositoryInMemory = new BooksRepositoryInMemory()
    projectsRepositoryInMemory = new ProjectsRepositoryInMemory()

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

    createBookUseCase = new CreateBookUseCase(
      booksRepositoryInMemory,
      projectsRepositoryInMemory,
      notifyUsersProvider,
      verifyPermissionsService,
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

  it('Should be able to create tag to book in project', async () => {
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

    const project = await projectsRepositoryInMemory.findById(newProject.id)

    expect(project.tags.length).toEqual(1)
  })
  it('Should be able to update tag to book in project if another books already created', async () => {
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

    const project = await projectsRepositoryInMemory.findById(newProject.id)

    expect(project.tags.length).toEqual(1)
    expect(project.tags[0].refs[0].references.length).toEqual(2)
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
