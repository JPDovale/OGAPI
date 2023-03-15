import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { type IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { type IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { BooksRepositoryInMemory } from '@modules/books/infra/mongoose/repositories/inMemory/booksRepositoryInMemory'
import { type IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { BoxesRepositoryInMemory } from '@modules/boxes/infra/mongoose/repositories/inMemory/BoxesRepositoryInMemory'
import { type ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { PersonsRepositoryInMemory } from '@modules/persons/repositories/inMemory/PersonsRepositoryInMemory'
import { type IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { type ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { PlotProject } from '@modules/projects/infra/mongoose/entities/Plot'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { type IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { type ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { RedisCacheProvider } from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider'
import { type IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider'
import { NotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/implementations/NotifyUsersProvider'
import { type INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { AppError } from '@shared/errors/AppError'

import { DeleteProjectUseCase } from './DeleteProjectUseCase'

let projectsRepositoryInMemory: IProjectsRepository
let usersRepositoryInMemory: IUsersRepository
let personsRepositoryInMemory: IPersonsRepository
let booksRepositoryInMemory: IBooksRepository
let boxesRepositoryInMemory: IBoxesRepository

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
    boxesRepositoryInMemory = new BoxesRepositoryInMemory()

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
      boxesRepositoryInMemory,
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
      createdPerUser: user!.id,
      users: [],
      plot: new PlotProject({}),
    }

    await projectsRepositoryInMemory.create(newProjectTest)
    const newProject = await projectsRepositoryInMemory.create(newProjectTest)

    await deleteProjectUseCase.execute(newProject!.id, user!.id)

    const projectsThisUser = await projectsRepositoryInMemory.listPerUser(
      user!.id,
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
      createdPerUser: user!.id,
      users: [
        {
          email: user!.email,
          id: user!.id,
          permission: 'edit',
        },
        {
          email: user!.email,
          id: user!.id,
          permission: 'edit',
        },
      ],
      plot: new PlotProject({}),
    }

    await projectsRepositoryInMemory.create(newProjectTest)
    const newProject = await projectsRepositoryInMemory.create(newProjectTest)

    await deleteProjectUseCase.execute(newProject!.id, user!.id)

    const projectsThisUser = await projectsRepositoryInMemory.listPerUser(
      user!.id,
    )
    const user2Notified = await usersRepositoryInMemory.findById(user2!.id)
    console.log(user2Notified)

    expect(projectsThisUser.length).toEqual(1)
    expect(user2Notified!.notifications.length).toEqual(1)
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

  it('Shout be able automatically delete boxes on project', async () => {
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

    await boxesRepositoryInMemory.create({
      name: 'Teste',
      tags: [],
      userId: user.id,
      projectId: newProject.id,
      internal: true,
    })

    await deleteProjectUseCase.execute(newProject.id, user.id)

    const projectsThisUser = await projectsRepositoryInMemory.listPerUser(
      user.id,
    )
    const boxesThisUser = await boxesRepositoryInMemory.listPerUser(user.id)

    expect(projectsThisUser.length).toEqual(0)
    expect(boxesThisUser.length).toEqual(0)
  })
})
