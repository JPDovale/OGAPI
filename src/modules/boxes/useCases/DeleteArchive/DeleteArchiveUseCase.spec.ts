import 'reflect-metadata'

import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { type IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { type IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { BoxesRepositoryInMemory } from '@modules/boxes/infra/mongoose/repositories/inMemory/BoxesRepositoryInMemory'
import { FirebaseStorageProvider } from '@shared/container/providers/StorageProvider/implementations/FirebaseStorageProvider'
import { type IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { AppError } from '@shared/errors/AppError'

import { DeleteArchiveUseCase } from './DeleteArchiveUseCase'

let usersRepository: IUsersRepository

let boxesRepository: IBoxesRepository
let storageProvider: IStorageProvider

let deleteArchiveUseCase: DeleteArchiveUseCase

describe('Delete archive', () => {
  beforeEach(() => {
    usersRepository = new UserRepositoryInMemory()

    boxesRepository = new BoxesRepositoryInMemory()
    storageProvider = new FirebaseStorageProvider()

    deleteArchiveUseCase = new DeleteArchiveUseCase(
      boxesRepository,
      storageProvider,
    )
  })

  it('should be able delete archive', async () => {
    const user = await usersRepository.create({
      age: 'teste',
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      sex: 'test',
      username: 'test',
    })

    const newBox = await boxesRepository.create({
      name: 'teste',
      internal: false,
      tags: [
        {
          name: 'test',
        },
      ],
      userId: user!.id,
      archives: [
        {
          archive: {
            title: 'test',
            description: 'test description',
            createdAt: 'teste',
            updatedAt: 'teste',
            id: 'teste1',
          },
          images: [],
          links: [],
        },
        {
          archive: {
            title: 'test',
            description: 'test description',
            createdAt: 'teste',
            updatedAt: 'teste',
            id: 'teste2',
          },
          images: [],
          links: [],
        },
      ],
    })

    const response = await deleteArchiveUseCase.execute({
      archiveId: 'teste1',
      boxId: newBox!.id,
    })

    expect(response.box.archives.length).toEqual(1)
  })

  it('not should be able delete archive if box not existes', async () => {
    expect(async () => {
      await deleteArchiveUseCase.execute({
        archiveId: 'teste1',
        boxId: 'un existent Id',
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })

  it('not should be able delete archive if archive not existes', async () => {
    expect(async () => {
      const user = await usersRepository.create({
        age: 'teste',
        email: 'test@test.com',
        name: 'test',
        password: 'test',
        sex: 'test',
        username: 'test',
      })

      const newBox = await boxesRepository.create({
        name: 'teste',
        internal: false,
        tags: [
          {
            name: 'test',
          },
        ],
        userId: user!.id,
      })

      await deleteArchiveUseCase.execute({
        archiveId: 'un existent Id',
        boxId: newBox!.id,
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
