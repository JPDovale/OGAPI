import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { RefreshTokenRepositoryInMemory } from '@modules/accounts/repositories/inMemory/RefreshTokenRepositoryInMemory'
import { UserRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UserRepositoryInMemory'
import { PersonsRepositoryInMemory } from '@modules/persons/repositories/inMemory/PersonsRepositoryInMemory'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { FirebaseStorageProvider } from '@shared/container/provides/StorageProvider/implementations/FirebaseStorageProvider'

import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { ListUsersUseCase } from '../listUsers/ListUsersUseCase'
import { DeleteUserUseCase } from './DeleteUserUseCase'

let deleteUserUseCase: DeleteUserUseCase
let createUserUseCase: CreateUserUseCase
let userRepositoryInMemory: UserRepositoryInMemory
let listUsersUseCase: ListUsersUseCase
let storageProvider: FirebaseStorageProvider
let projectsRepositoryInMemory: ProjectsRepositoryInMemory
let personsRepositoryInMemory: PersonsRepositoryInMemory
let refreshTokenRepositoryInMemory: RefreshTokenRepositoryInMemory

describe('Delete user test', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    storageProvider = new FirebaseStorageProvider()
    projectsRepositoryInMemory = new ProjectsRepositoryInMemory()
    personsRepositoryInMemory = new PersonsRepositoryInMemory()
    refreshTokenRepositoryInMemory = new RefreshTokenRepositoryInMemory()

    deleteUserUseCase = new DeleteUserUseCase(
      userRepositoryInMemory,
      storageProvider,
      projectsRepositoryInMemory,
      personsRepositoryInMemory,
      refreshTokenRepositoryInMemory,
    )
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    listUsersUseCase = new ListUsersUseCase(userRepositoryInMemory)
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

    const user = await createUserUseCase.execute(newUserTest)
    await createUserUseCase.execute(newUserTest2)

    await deleteUserUseCase.execute(user.id)

    const allUsers = await listUsersUseCase.execute()

    expect(allUsers.length).toEqual(1)
  })
})
