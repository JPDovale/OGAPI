import 'reflect-metadata'

import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { BoxesRepositoryInMemory } from '@modules/boxes/infra/mongoose/repositories/inMemory/BoxesRepositoryInMemory'
import { FirebaseStorageProvider } from '@shared/container/providers/StorageProvider/implementations/FirebaseStorageProvider'
import { type IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { AppError } from '@shared/errors/AppError'

import { DeleteBoxUseCase } from './DeleteBoxUseCase'

let usersRepository: IUsersRepository

let boxesRepository: IBoxesRepository
let storageProvider: IStorageProvider

let deleteBoxUseCase: DeleteBoxUseCase

describe('Delete archive', () => {
  beforeEach(() => {
    usersRepository = new UserRepositoryInMemory()

    boxesRepository = new BoxesRepositoryInMemory()
    storageProvider = new FirebaseStorageProvider()

    deleteBoxUseCase = new DeleteBoxUseCase(boxesRepository, storageProvider)
  })

  it('should be able delete box', async () => {
    const user = await usersRepository.create({
      age: 'teste',
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      sex: 'test',
      username: 'test',
    })

    const newBoxMock = {
      name: 'teste',
      internal: false,
      tags: [
        {
          name: 'test',
        },
      ],
      userId: user!.id,
    }

    const newBox = await boxesRepository.create(newBoxMock)
    await boxesRepository.create(newBoxMock)
    await boxesRepository.create(newBoxMock)
    await boxesRepository.create(newBoxMock)

    await deleteBoxUseCase.execute({
      boxId: newBox!.id,
    })

    const boxesThisUser = await boxesRepository.findByUserId(user!.id)

    expect(boxesThisUser.length).toEqual(3)
  })

  it('not should be able delete box if box not existes', async () => {
    expect(async () => {
      await deleteBoxUseCase.execute({
        boxId: 'un existent Id',
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
