import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { RefreshTokenRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/RefreshTokenRepositoryInMemory'
import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { BooksRepositoryInMemory } from '@modules/books/infra/mongoose/repositories/inMemory/booksRepositoryInMemory'
import { ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { PersonsRepositoryInMemory } from '@modules/persons/repositories/inMemory/PersonsRepositoryInMemory'
import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { FirebaseStorageProvider } from '@shared/container/provides/StorageProvider/implementations/FirebaseStorageProvider'

import { DeleteUserUseCase } from './DeleteUserUseCase'

let deleteUserUseCase: DeleteUserUseCase

let userRepositoryInMemory: UserRepositoryInMemory
let storageProvider: FirebaseStorageProvider
let projectsRepositoryInMemory: ProjectsRepositoryInMemory
let personsRepositoryInMemory: PersonsRepositoryInMemory
let refreshTokenRepositoryInMemory: RefreshTokenRepositoryInMemory
let booksRepositoryInMemory: BooksRepositoryInMemory

describe('Delete user test', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    storageProvider = new FirebaseStorageProvider()
    projectsRepositoryInMemory = new ProjectsRepositoryInMemory()
    personsRepositoryInMemory = new PersonsRepositoryInMemory()
    refreshTokenRepositoryInMemory = new RefreshTokenRepositoryInMemory()
    projectsRepositoryInMemory = new ProjectsRepositoryInMemory()
    booksRepositoryInMemory = new BooksRepositoryInMemory()

    deleteUserUseCase = new DeleteUserUseCase(
      userRepositoryInMemory,
      storageProvider,
      projectsRepositoryInMemory,
      personsRepositoryInMemory,
      refreshTokenRepositoryInMemory,
      booksRepositoryInMemory,
    )
  })

  it('Should be abele delete user', async () => {
    const newUserTest: ICreateUserDTO = {
      name: 'Unitary test to delete user',
      email: 'test@test.com',
      age: '18',
      password: 'test123',
      sex: 'test',
      username: 'Test to delete user',
    }

    const newUserTest2: ICreateUserDTO = {
      name: 'Unitary test to delete user',
      email: 'test2@test2.com',
      age: '18',
      password: 'test123',
      sex: 'test',
      username: 'Test to delete user',
    }

    const user = await userRepositoryInMemory.create(newUserTest)
    await userRepositoryInMemory.create(newUserTest2)

    await deleteUserUseCase.execute(user.id)

    const allUsers = await userRepositoryInMemory.list()

    expect(allUsers.length).toEqual(1)
  })

  it('Should be possible automatically delete projects of user when user deleted', async () => {
    const newUserTest: ICreateUserDTO = {
      name: 'Unitary test to delete user',
      email: 'test@test.com',
      age: '18',
      password: 'test123',
      sex: 'test',
      username: 'Test to delete user',
    }

    const newUserTest2: ICreateUserDTO = {
      name: 'Unitary test to delete user',
      email: 'test2@test2.com',
      age: '18',
      password: 'test123',
      sex: 'test',
      username: 'Test to delete user',
    }

    const user = await userRepositoryInMemory.create(newUserTest)
    await userRepositoryInMemory.create(newUserTest2)

    const projectToUserTest: ICreateProjectDTO = {
      createdPerUser: user.id,
      name: 'Project test',
      plot: {},
      private: false,
      type: 'book',
      users: [
        {
          email: user.email,
          id: user.id,
          permission: 'edit',
        },
      ],
    }

    await projectsRepositoryInMemory.create(projectToUserTest)
    await deleteUserUseCase.execute(user.id)

    const allUsers = await userRepositoryInMemory.list()
    const projectsOfUser = await projectsRepositoryInMemory.listPerUser(user.id)

    expect(allUsers.length).toEqual(1)
    expect(projectsOfUser.length).toEqual(0)
  })

  it('Should be possible automatically delete persons of user when user deleted', async () => {
    const newUserTest: ICreateUserDTO = {
      name: 'Unitary test to delete user',
      email: 'test@test.com',
      age: '18',
      password: 'test123',
      sex: 'test',
      username: 'Test to delete user',
    }

    const newUserTest2: ICreateUserDTO = {
      name: 'Unitary test to delete user',
      email: 'test2@test2.com',
      age: '18',
      password: 'test123',
      sex: 'test',
      username: 'Test to delete user',
    }

    const user = await userRepositoryInMemory.create(newUserTest)
    await userRepositoryInMemory.create(newUserTest2)

    const projectToUserTest: ICreateProjectDTO = {
      createdPerUser: user.id,
      name: 'Project test',
      plot: {},
      private: false,
      type: 'book',
      users: [
        {
          email: user.email,
          id: user.id,
          permission: 'edit',
        },
      ],
    }

    const project = await projectsRepositoryInMemory.create(projectToUserTest)

    const personToUserTest: ICreatePersonDTO = {
      name: 'jonas',
      age: '18',
      history: 'Teste',
      lastName: 'repolho',
    }

    await personsRepositoryInMemory.create(
      user.id,
      project.id,
      personToUserTest,
    )
    await deleteUserUseCase.execute(user.id)

    const allUsers = await userRepositoryInMemory.list()
    const projectsOfUser = await projectsRepositoryInMemory.listPerUser(user.id)
    const personsOfUser = await personsRepositoryInMemory.listPerUser(user.id)

    expect(allUsers.length).toEqual(1)
    expect(projectsOfUser.length).toEqual(0)
    expect(personsOfUser.length).toEqual(0)
  })

  it('Should be possible automatically delete books of user when user deleted', async () => {
    const newUserTest: ICreateUserDTO = {
      name: 'Unitary test to delete user',
      email: 'test@test.com',
      age: '18',
      password: 'test123',
      sex: 'test',
      username: 'Test to delete user',
    }

    const newUserTest2: ICreateUserDTO = {
      name: 'Unitary test to delete user',
      email: 'test2@test2.com',
      age: '18',
      password: 'test123',
      sex: 'test',
      username: 'Test to delete user',
    }

    const user = await userRepositoryInMemory.create(newUserTest)
    await userRepositoryInMemory.create(newUserTest2)

    const projectToUserTest: ICreateProjectDTO = {
      createdPerUser: user.id,
      name: 'Project test',
      plot: {},
      private: false,
      type: 'book',
      users: [
        {
          email: user.email,
          id: user.id,
          permission: 'edit',
        },
      ],
    }

    const project = await projectsRepositoryInMemory.create(projectToUserTest)
    await booksRepositoryInMemory.create({
      projectId: project.id,
      book: {
        authors: [],
        createdPerUser: user.id,
        generes: [{ name: 'teste' }],
        literaryGenere: 'teste',
        title: 'teste',
      },
    })

    await deleteUserUseCase.execute(user.id)

    const allUsers = await userRepositoryInMemory.list()
    const projectsOfUser = await projectsRepositoryInMemory.listPerUser(user.id)
    const booksOfUser = await booksRepositoryInMemory.listPerUser(user.id)

    expect(allUsers.length).toEqual(1)
    expect(projectsOfUser.length).toEqual(0)
    expect(booksOfUser.length).toEqual(0)
  })
})
