import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type ICreateBookDTO } from '@modules/books/dtos/ICreateBookDTO'
import { BooksRepositoryInMemory } from '@modules/books/infra/mongoose/repositories/inMemory/booksRepositoryInMemory'
import { type IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { type ICreateBoxDTO } from '@modules/boxes/dtos/ICrateBoxDTO'
import { type IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { BoxesRepositoryInMemory } from '@modules/boxes/infra/mongoose/repositories/inMemory/BoxesRepositoryInMemory'
import { type ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { type IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { PersonsRepositoryInMemory } from '@modules/persons/repositories/inMemory/PersonsRepositoryInMemory'
import { type ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { type IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'

import { ListProjectsPerUserUseCase } from './ListProjectsPerUserUseCase'

let projectsRepositoryInMemory: IProjectsRepository
let usersRepositoryInMemory: IUsersRepository
let personsRepositoryInMemory: IPersonsRepository
let booksRepositoryInMemory: IBooksRepository
let boxesRepositoryInMemory: IBoxesRepository

let listProjectsPerUserUseCase: ListProjectsPerUserUseCase

describe('List project per user', () => {
  beforeEach(() => {
    projectsRepositoryInMemory = new ProjectsRepositoryInMemory()
    usersRepositoryInMemory = new UserRepositoryInMemory()
    personsRepositoryInMemory = new PersonsRepositoryInMemory()
    booksRepositoryInMemory = new BooksRepositoryInMemory()
    boxesRepositoryInMemory = new BoxesRepositoryInMemory()

    listProjectsPerUserUseCase = new ListProjectsPerUserUseCase(
      projectsRepositoryInMemory,
      usersRepositoryInMemory,
      personsRepositoryInMemory,
      booksRepositoryInMemory,
      boxesRepositoryInMemory,
    )
  })

  it('should be able list projects per user', async () => {
    const user = await usersRepositoryInMemory.create({
      age: 'uncharacterized',
      email: 'test@test.com',
      name: 'test',
      password: 'password',
      sex: 'uncharacterized',
      username: 't',
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
    await projectsRepositoryInMemory.create(newProjectTest)

    const response = await listProjectsPerUserUseCase.execute(user.id)

    expect(response.projects.length).toEqual(2)
  })

  it('should be able list users in projects when user list projects', async () => {
    const user = await usersRepositoryInMemory.create({
      age: 'uncharacterized',
      email: 'test@test.com',
      name: 'test',
      password: 'password',
      sex: 'uncharacterized',
      username: 't',
    })

    const user2 = await usersRepositoryInMemory.create({
      age: 'uncharacterized',
      email: 'test2@test2.com',
      name: 'test',
      password: 'password',
      sex: 'uncharacterized',
      username: 't2',
    })

    const user3 = await usersRepositoryInMemory.create({
      age: 'uncharacterized',
      email: 'test3@test3.com',
      name: 'test',
      password: 'password',
      sex: 'uncharacterized',
      username: 't3',
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
          permission: 'comment',
        },
        {
          email: user3.email,
          id: user3.id,
          permission: 'view',
        },
      ],
      plot: {},
    }

    await projectsRepositoryInMemory.create(newProjectTest)
    await projectsRepositoryInMemory.create(newProjectTest)

    const response = await listProjectsPerUserUseCase.execute(user.id)

    expect(response.projects.length).toEqual(2)
    expect(response.users.length).toEqual(2)
  })

  it('should be able list books in projects when user list projects', async () => {
    const user = await usersRepositoryInMemory.create({
      age: 'uncharacterized',
      email: 'test@test.com',
      name: 'test',
      password: 'password',
      sex: 'uncharacterized',
      username: 't',
    })

    const newProjectTest = await projectsRepositoryInMemory.create({
      name: 'test',
      private: false,
      type: 'book',
      createdPerUser: user.id,
      users: [],
      plot: {},
    })

    const newBook: ICreateBookDTO = {
      authors: [],
      createdPerUser: user.id,
      generes: [],
      literaryGenere: 'test',
      title: 'test',
    }

    await booksRepositoryInMemory.create({
      projectId: newProjectTest.id,
      book: newBook,
    })

    await booksRepositoryInMemory.create({
      projectId: newProjectTest.id,
      book: newBook,
    })

    const response = await listProjectsPerUserUseCase.execute(user.id)

    expect(response.projects.length).toEqual(1)
    expect(response.books.length).toEqual(2)
  })

  it('should be able list persons in projects when user list projects', async () => {
    const user = await usersRepositoryInMemory.create({
      age: 'uncharacterized',
      email: 'test@test.com',
      name: 'test',
      password: 'password',
      sex: 'uncharacterized',
      username: 't',
    })

    const newProjectTest = await projectsRepositoryInMemory.create({
      name: 'test',
      private: false,
      type: 'book',
      createdPerUser: user.id,
      users: [],
      plot: {},
    })

    const newPerson: ICreatePersonDTO = {
      age: '123',
      history: '',
      lastName: 'teste',
      name: 'sabonete',
    }

    await personsRepositoryInMemory.create(
      user.id,
      newProjectTest.id,
      newPerson,
    )
    await personsRepositoryInMemory.create(
      user.id,
      newProjectTest.id,
      newPerson,
    )
    await personsRepositoryInMemory.create(
      user.id,
      newProjectTest.id,
      newPerson,
    )

    const response = await listProjectsPerUserUseCase.execute(user.id)

    expect(response.projects.length).toEqual(1)
    expect(response.persons.length).toEqual(3)
  })

  it('should be able list boxes in projects when user list projects', async () => {
    const user = await usersRepositoryInMemory.create({
      age: 'uncharacterized',
      email: 'test@test.com',
      name: 'test',
      password: 'password',
      sex: 'uncharacterized',
      username: 't',
    })

    const newProjectTest = await projectsRepositoryInMemory.create({
      name: 'test',
      private: false,
      type: 'book',
      createdPerUser: user.id,
      users: [],
      plot: {},
    })

    const newBox: ICreateBoxDTO = {
      name: 'sabonete',
      tags: [],
      userId: user.id,
      internal: true,
      projectId: newProjectTest.id,
    }

    await boxesRepositoryInMemory.create(newBox)
    await boxesRepositoryInMemory.create(newBox)
    await boxesRepositoryInMemory.create(newBox)
    await boxesRepositoryInMemory.create(newBox)

    const response = await listProjectsPerUserUseCase.execute(user.id)

    expect(response.projects.length).toEqual(1)
    expect(response.boxes.length).toEqual(4)
  })
})
