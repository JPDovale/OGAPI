import 'reflect-metadata'

import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { type IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { type IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { BooksRepositoryInMemory } from '@modules/books/infra/mongoose/repositories/inMemory/booksRepositoryInMemory'
import { type ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { type IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { type ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { RedisCacheProvider } from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider'
import { type IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider'
import { NotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/implementations/NotifyUsersProvider'
import { type INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { VerifyPermissions } from '@shared/container/services/verifyPermissions/implementations/VerifyPermissions'
import { type IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

import { RemoveGenreUseCase } from './RemoveGenreUseCase'

let usersRepositoryInMemory: IUsersRepository
let booksRepositoryInMemory: IBooksRepository
let projectsRepositoryInMemory: IProjectsRepository

let dateProvider: IDateProvider
let cacheProvider: ICacheProvider
let notifyUsersProvider: INotifyUsersProvider

let verifyPermissionsService: IVerifyPermissionsService

let removeGenreUseCase: RemoveGenreUseCase

describe('Remove genre', () => {
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

    removeGenreUseCase = new RemoveGenreUseCase(
      booksRepositoryInMemory,
      verifyPermissionsService,
      notifyUsersProvider,
    )
  })

  it('Should be able to remove genre in book', async () => {
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

    const newBook = await booksRepositoryInMemory.create({
      projectId: newProject.id,
      book: {
        authors: [{ email: user.email, id: user.id, username: user.username }],
        createdPerUser: user.id,
        generes: [{ name: 'test' }, { name: 'test2' }],
        literaryGenere: 'test',
        title: 'teste',
        isbn: 'undefined',
      },
    })

    await removeGenreUseCase.execute({
      bookId: newBook.id,
      userId: user.id,
      genre: 'test2',
    })

    const bookWithNewGenre = await booksRepositoryInMemory.findById(newBook.id)

    expect(bookWithNewGenre.generes.length).toEqual(1)
  })

  it('Should be able to notify users on project about removed genre in book', async () => {
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

    const newBook = await booksRepositoryInMemory.create({
      projectId: newProject.id,
      book: {
        authors: [{ email: user.email, id: user.id, username: user.username }],
        createdPerUser: user.id,
        generes: [{ name: 'test' }, { name: 'test2' }],
        literaryGenere: 'test',
        title: 'teste',
        isbn: 'undefined',
      },
    })

    await removeGenreUseCase.execute({
      bookId: newBook.id,
      genre: 'test2',
      userId: user.id,
    })

    const userNotified = await usersRepositoryInMemory.findById(userToNotify.id)

    expect(userNotified.notifications.length).toEqual(1)
  })

  it("not should be able to remove genre in book if user doesn't not permission", async () => {
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

      const newBook = await booksRepositoryInMemory.create({
        projectId: newProject.id,
        book: {
          authors: [
            { email: user.email, id: user.id, username: user.username },
          ],
          createdPerUser: user.id,
          generes: [{ name: 'test' }, { name: 'test2' }],
          literaryGenere: 'test',
          title: 'teste',
          isbn: 'undefined',
        },
      })

      await removeGenreUseCase.execute({
        bookId: newBook.id,
        genre: 'test2',
        userId: user2.id,
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })

  it('not should be able to remove genre in book if length genres is equal 1 or minus', async () => {
    expect(async () => {
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

      const newBook = await booksRepositoryInMemory.create({
        projectId: newProject.id,
        book: {
          authors: [
            { email: user.email, id: user.id, username: user.username },
          ],
          createdPerUser: user.id,
          generes: [{ name: 'test' }],
          literaryGenere: 'test',
          title: 'teste',
          isbn: 'undefined',
        },
      })

      await removeGenreUseCase.execute({
        bookId: newBook.id,
        genre: 'test',
        userId: user.id,
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
