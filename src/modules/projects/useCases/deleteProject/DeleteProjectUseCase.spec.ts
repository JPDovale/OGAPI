import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { BooksRepositoryInMemory } from '@modules/books/infra/mongoose/repositories/inMemory/booksRepositoryInMemory'
import { ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { PersonsRepositoryInMemory } from '@modules/persons/repositories/inMemory/PersonsRepositoryInMemory'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { ICacheProvider } from '@shared/container/provides/CacheProvider/ICacheProvider'
import { RedisCacheProvider } from '@shared/container/provides/CacheProvider/implementations/RedisCacheProvider'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { DayJsDateProvider } from '@shared/container/provides/DateProvider/implementations/DayJsDateProvider'
import { NotifyUsersProvider } from '@shared/container/provides/NotifyUsersProvider/implementations/NotifyUsersProvider'
import { INotifyUsersProvider } from '@shared/container/provides/NotifyUsersProvider/INotifyUsersProvider'
import { AppError } from '@shared/errors/AppError'

import { DeleteProjectUseCase } from './DeleteProjectUseCase'

let projectsRepositoryInMemory: IProjectsRepository
let usersRepositoryInMemory: IUsersRepository
let personsRepositoryInMemory: IPersonsRepository
let booksRepositoryInMemory: IBooksRepository

let notifyUsersProvider: INotifyUsersProvider
let cacheProvider: ICacheProvider
let dateProvider: IDateProvider

let deleteProjectUseCase: DeleteProjectUseCase

describe('Delete project', () => {
  beforeEach(() => {
    projectsRepositoryInMemory = new ProjectsRepositoryInMemory()
    usersRepositoryInMemory = new UserRepositoryInMemory()
    personsRepositoryInMemory = new PersonsRepositoryInMemory()
    booksRepositoryInMemory = new BooksRepositoryInMemory()

    dateProvider = new DayJsDateProvider()
    cacheProvider = new RedisCacheProvider(dateProvider)
    notifyUsersProvider = new NotifyUsersProvider(
      usersRepositoryInMemory,
      cacheProvider,
    )

    deleteProjectUseCase = new DeleteProjectUseCase(
      projectsRepositoryInMemory,
      usersRepositoryInMemory,
      personsRepositoryInMemory,
      notifyUsersProvider,
      booksRepositoryInMemory,
    )
  })

  it('Shout be able delete project', async () => {
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
      users: [],
      plot: {},
    }

    await projectsRepositoryInMemory.create(newProjectTest)
    const newProject = await projectsRepositoryInMemory.create(newProjectTest)

    await deleteProjectUseCase.execute(newProject.id, user.id)

    const projectsThisUser = await projectsRepositoryInMemory.listPerUser(
      user.id,
    )

    expect(projectsThisUser.length).toEqual(1)
  })

  it('Shout be able notify users on project when this deleted', async () => {
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
          permission: 'edit',
        },
      ],
      plot: {},
    }

    await projectsRepositoryInMemory.create(newProjectTest)
    const newProject = await projectsRepositoryInMemory.create(newProjectTest)

    await deleteProjectUseCase.execute(newProject.id, user.id)

    const projectsThisUser = await projectsRepositoryInMemory.listPerUser(
      user.id,
    )
    const user2Notified = await usersRepositoryInMemory.findById(user2.id)

    expect(projectsThisUser.length).toEqual(1)
    expect(user2Notified.notifications.length).toEqual(1)
  })

  it('Not shout be able delete project if user not is creator', async () => {
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
        users: [],
        plot: {},
      }

      await projectsRepositoryInMemory.create(newProjectTest)
      const newProject = await projectsRepositoryInMemory.create(newProjectTest)

      await deleteProjectUseCase.execute(newProject.id, user2.id)
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })

  it('Shout be able automatically delete persons on project', async () => {
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

    const newProject = await projectsRepositoryInMemory.create(newProjectTest)

    const newPersonTest: ICreatePersonDTO = {
      age: '12',
      history: '',
      lastName: 'repolho',
      name: 'jonas',
    }

    await personsRepositoryInMemory.create(
      user.id,
      newProject.id,
      newPersonTest,
    )
    await deleteProjectUseCase.execute(newProject.id, user.id)

    const projectsThisUser = await projectsRepositoryInMemory.listPerUser(
      user.id,
    )
    const personsThisUser = await personsRepositoryInMemory.listPerUser(user.id)

    expect(projectsThisUser.length).toEqual(0)
    expect(personsThisUser.length).toEqual(0)
  })

  it('Shout be able automatically delete books on project', async () => {
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

    const newProject = await projectsRepositoryInMemory.create(newProjectTest)

    await booksRepositoryInMemory.create({
      projectId: newProject.id,
      book: {
        authors: [],
        createdPerUser: user.id,
        generes: [{ name: 'teste' }],
        literaryGenere: 'teste',
        title: 'teste',
      },
    })

    await deleteProjectUseCase.execute(newProject.id, user.id)

    const projectsThisUser = await projectsRepositoryInMemory.listPerUser(
      user.id,
    )
    const booksThisUser = await booksRepositoryInMemory.listPerUser(user.id)

    expect(projectsThisUser.length).toEqual(0)
    expect(booksThisUser.length).toEqual(0)
  })
})
