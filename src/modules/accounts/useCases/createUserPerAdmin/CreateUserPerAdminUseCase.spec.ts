import { UserRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UserRepositoryInMemory'

import { CreateUserPerAdminUseCase } from './CreateUserPerAdminUseCase'

let createUserPerAdminUseCase: CreateUserPerAdminUseCase
let userRepositoryInMemory: UserRepositoryInMemory

describe('Create user per admin', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    createUserPerAdminUseCase = new CreateUserPerAdminUseCase(
      userRepositoryInMemory,
    )
  })

  it('Should be able to create user per admin', async () => {
    const newUser = {
      name: 'new user per admin',
    }

    const userCreated = await createUserPerAdminUseCase.execute(newUser)

    expect(userCreated).toHaveProperty('id')
    expect(userCreated).toHaveProperty('code')
    expect(userCreated.isInitialized).toEqual(true)
  })
})
