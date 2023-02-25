import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { ICreateBookDTO } from '@modules/books/dtos/ICreateBookDTO'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { BooksRepositoryInMemory } from '@modules/books/infra/mongoose/repositories/inMemory/booksRepositoryInMemory'
import { ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { PersonsRepositoryInMemory } from '@modules/persons/repositories/inMemory/PersonsRepositoryInMemory'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'

import { ListProjectsPerUserUseCase } from './ListProjectsPerUserUseCase'

let projectsRepositoryInMemory: IProjectsRepository
let usersRepositoryInMemory: IUsersRepository
let personsRepositoryInMemory: IPersonsRepository
let booksRepositoryInMemory: IBooksRepository

let listProjectsPerUserUseCase: ListProjectsPerUserUseCase

describe('List project per user', () => {
  beforeEach(() => {
    projectsRepositoryInMemory = new ProjectsRepositoryInMemory()
    usersRepositoryInMemory = new UserRepositoryInMemory()
    personsRepositoryInMemory = new PersonsRepositoryInMemory()
    booksRepositoryInMemory = new BooksRepositoryInMemory()

    listProjectsPerUserUseCase = new ListProjectsPerUserUseCase(
      projectsRepositoryInMemory,
      usersRepositoryInMemory,
      personsRepositoryInMemory,
      booksRepositoryInMemory,
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
})
