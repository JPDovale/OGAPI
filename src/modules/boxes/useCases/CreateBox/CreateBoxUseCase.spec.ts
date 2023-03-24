import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { type IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { type ICreateBoxDTO } from '@modules/boxes/dtos/ICrateBoxDTO'
import { type IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { BoxesRepositoryInMemory } from '@modules/boxes/infra/mongoose/repositories/inMemory/BoxesRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'

import { CreateBoxUseCase } from './CreateBoxUseCase'

let usersRepositoryInMemory: IUsersRepository
let boxesRepositoryInMemory: IBoxesRepository

let createBoxUseCase: CreateBoxUseCase

describe('Create box', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UserRepositoryInMemory()
    boxesRepositoryInMemory = new BoxesRepositoryInMemory()

    createBoxUseCase = new CreateBoxUseCase(
      usersRepositoryInMemory,
      boxesRepositoryInMemory,
    )
  })

  it('Should be able to create a box', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'teste',
      age: 'teste',
      email: 'teste@test.com',
      password: 'teste',
      sex: 'teste',
      username: 'teste',
    })

    await createBoxUseCase.execute({
      userId: user!.id,
      name: 'Teste box',
      tags: [
        {
          name: 'teste',
        },
      ],
    })

    const boxesThisUser = await boxesRepositoryInMemory.listPerUser(user.id)

    expect(boxesThisUser.length).toEqual(1)
  })

  it('not should be able to create a box if user already created another 3 or mode boxes and not assign any plan', async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        name: 'teste',
        age: 'teste',
        email: 'teste@test.com',
        password: 'teste',
        sex: 'teste',
        username: 'teste',
      })

      const newBox: ICreateBoxDTO = {
        userId: user.id,
        name: 'Teste box',
        tags: [
          {
            name: 'teste',
          },
        ],
      }

      await boxesRepositoryInMemory.create(newBox)
      await boxesRepositoryInMemory.create(newBox)
      await boxesRepositoryInMemory.create(newBox)

      await createBoxUseCase.execute({
        userId: user.id,
        name: 'Teste box',
        tags: [
          {
            name: 'teste',
          },
        ],
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
  it('Should be able to create more than 3 boxes if user payed for this', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'teste',
      age: 'teste',
      email: 'teste@test.com',
      password: 'teste',
      sex: 'teste',
      username: 'teste',
      payed: true,
    })

    const newBox: ICreateBoxDTO = {
      userId: user.id,
      name: 'Teste box',
      tags: [
        {
          name: 'teste',
        },
      ],
    }

    await boxesRepositoryInMemory.create(newBox)
    await boxesRepositoryInMemory.create(newBox)
    await boxesRepositoryInMemory.create(newBox)

    await createBoxUseCase.execute({
      userId: user.id,
      name: 'Teste box',
      tags: [
        {
          name: 'teste',
        },
      ],
    })

    const boxesThisUser = await boxesRepositoryInMemory.listPerUser(user.id)

    expect(boxesThisUser.length).toEqual(4)
  })
})
