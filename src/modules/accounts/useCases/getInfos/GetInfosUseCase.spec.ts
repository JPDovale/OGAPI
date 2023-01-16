import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { UserRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UserRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'

import { GetInfosUseCase } from './GetInfosUseCase'

let userRepositoryInMemory: UserRepositoryInMemory
let getInfosUseCase: GetInfosUseCase

describe('Get user infos', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    getInfosUseCase = new GetInfosUseCase(userRepositoryInMemory)
  })

  it('Should be able to get infos from one user', async () => {
    const newUserTest: ICreateUserDTO = {
      name: 'Unitary test to delete user',
      email: 'test@test.com',
      age: '18',
      password: 'test123',
      sex: 'test',
      username: 'Test to delete user',
    }

    const userCreated = await userRepositoryInMemory.create(newUserTest)

    const infosGet = await getInfosUseCase.execute(userCreated.id)

    expect(infosGet).toHaveProperty('id')
    expect(infosGet).toHaveProperty('email')
  })

  it('Not should be able to get infos from one user if he not existe', async () => {
    expect(async () => {
      await getInfosUseCase.execute('121212')
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
