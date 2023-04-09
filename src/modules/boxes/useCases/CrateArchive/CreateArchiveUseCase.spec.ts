import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { BoxesRepositoryInMemory } from '@modules/boxes/infra/mongoose/repositories/inMemory/BoxesRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'

import { CreateArchiveUseCase } from './CreateArchiveUseCase'

let boxesRepository: IBoxesRepository
let usersRepository: IUsersRepository

let createArchiveUseCase: CreateArchiveUseCase

describe('Create archive in box', () => {
  beforeEach(() => {
    boxesRepository = new BoxesRepositoryInMemory()
    usersRepository = new UserRepositoryInMemory()

    createArchiveUseCase = new CreateArchiveUseCase(
      boxesRepository,
      usersRepository,
    )
  })

  it('should be able to create archive in box', async () => {
    const user = await usersRepository.create({
      name: 'teste',
      age: 'teste',
      email: 'teste@test.com',
      password: 'teste',
      sex: 'teste',
      username: 'teste',
    })

    const box = await boxesRepository.create({
      internal: false,
      name: 'teste',
      tags: [{ name: 'test' }],
      userId: user!.id,
    })

    const { box: updatedBox } = await createArchiveUseCase.execute({
      boxId: box!.id,
      description: 'test description',
      title: 'test title',
      userId: user!.id,
    })

    expect(updatedBox.archives.length).toEqual(1)
  })

  it('not should be able to create archive in box if user not are creator', async () => {
    expect(async () => {
      const userMoc = {
        name: 'teste',
        age: 'teste',
        email: 'teste@test.com',
        password: 'teste',
        sex: 'teste',
        username: 'teste',
      }

      const user = await usersRepository.create(userMoc)
      const user2 = await usersRepository.create(userMoc)

      const box = await boxesRepository.create({
        internal: false,
        name: 'teste',
        tags: [{ name: 'test' }],
        userId: user!.id,
      })

      await createArchiveUseCase.execute({
        boxId: box!.id,
        description: 'test description',
        title: 'test title',
        userId: user2!.id,
        filesImages: [
          {
            createdAt: 'teste',
            fileName: 'teste.jpg',
            updatedAt: 'teste',
            url: 'teste.jpg',
          },
        ],
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })

  it('not should be able to create archive in box if archive length is more 5 and user not payed', async () => {
    expect(async () => {
      const userMoc = {
        name: 'teste',
        age: 'teste',
        email: 'teste@test.com',
        password: 'teste',
        sex: 'teste',
        username: 'teste',
      }

      const user = await usersRepository.create(userMoc)

      const box = await boxesRepository.create({
        internal: false,
        name: 'teste',
        tags: [{ name: 'test' }],
        userId: user!.id,
        archives: [
          {
            archive: {
              id: '1',
              createdAt: 'teste',
              description: 'test description',
              title: 'test title',
              updatedAt: 'teste',
            },
            images: [],
            links: [],
          },
          {
            archive: {
              id: '1',
              createdAt: 'teste',
              description: 'test description',
              title: 'test title',
              updatedAt: 'teste',
            },
            images: [],
            links: [],
          },
          {
            archive: {
              id: '1',
              createdAt: 'teste',
              description: 'test description',
              title: 'test title',
              updatedAt: 'teste',
            },
            images: [],
            links: [],
          },
          {
            archive: {
              id: '1',
              createdAt: 'teste',
              description: 'test description',
              title: 'test title',
              updatedAt: 'teste',
            },
            images: [],
            links: [],
          },
          {
            archive: {
              id: '1',
              createdAt: 'teste',
              description: 'test description',
              title: 'test title',
              updatedAt: 'teste',
            },
            images: [],
            links: [],
          },
        ],
      })

      await createArchiveUseCase.execute({
        boxId: box!.id,
        description: 'test description',
        title: 'test title',
        userId: user!.id,
        filesImages: [
          {
            createdAt: 'teste',
            fileName: 'teste.jpg',
            updatedAt: 'teste',
            url: 'teste.jpg',
          },
        ],
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
