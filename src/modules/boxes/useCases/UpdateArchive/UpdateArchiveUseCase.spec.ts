import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { BoxesRepositoryInMemory } from '@modules/boxes/infra/mongoose/repositories/inMemory/BoxesRepositoryInMemory'
import { type IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider'
import { AppError } from '@shared/errors/AppError'

import { UpdateArchiveUseCase } from './UpdateArchiveUseCase'

let usersRepositoryInMemory: IUsersRepository
let boxesRepositoryInMemory: IBoxesRepository

let dateProvider: IDateProvider

let updateArchiveUseCase: UpdateArchiveUseCase

describe('Update archive', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UserRepositoryInMemory()
    boxesRepositoryInMemory = new BoxesRepositoryInMemory()

    dateProvider = new DayJsDateProvider()

    updateArchiveUseCase = new UpdateArchiveUseCase(
      boxesRepositoryInMemory,
      dateProvider,
    )
  })

  it('Should be able to update archive title', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'teste',
      age: 'teste',
      email: 'teste@test.com',
      password: 'teste',
      sex: 'teste',
      username: 'teste',
    })

    const box = await boxesRepositoryInMemory.create({
      internal: false,
      name: 'test box',
      tags: [{ name: 'test' }],
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
      ],
    })

    const { box: boxUpdated } = await updateArchiveUseCase.execute({
      boxId: box!.id,
      archiveId: 'teste1',
      title: 'teste superemo',
    })

    const archiveUpdated = boxUpdated.archives.find(
      (a) => a.archive.id === 'teste1',
    )

    expect(archiveUpdated?.archive.title).toEqual('teste superemo')
    expect(archiveUpdated?.archive.description).toEqual('test description')
  })

  it('Should be able to update archive description', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'teste',
      age: 'teste',
      email: 'teste@test.com',
      password: 'teste',
      sex: 'teste',
      username: 'teste',
    })

    const box = await boxesRepositoryInMemory.create({
      internal: false,
      name: 'test box',
      tags: [{ name: 'test' }],
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
      ],
    })

    const { box: boxUpdated } = await updateArchiveUseCase.execute({
      boxId: box!.id,
      archiveId: 'teste1',
      description: 'teste superemo',
    })

    const archiveUpdated = boxUpdated.archives.find(
      (a) => a.archive.id === 'teste1',
    )

    expect(archiveUpdated?.archive.description).toEqual('teste superemo')
    expect(archiveUpdated?.archive.title).toEqual('test')
  })

  it('Should be able to update archive', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'teste',
      age: 'teste',
      email: 'teste@test.com',
      password: 'teste',
      sex: 'teste',
      username: 'teste',
    })

    const box = await boxesRepositoryInMemory.create({
      internal: false,
      name: 'test box',
      tags: [{ name: 'test' }],
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
      ],
    })

    const { box: boxUpdated } = await updateArchiveUseCase.execute({
      boxId: box!.id,
      archiveId: 'teste1',
      description: 'teste superemo',
      title: 'teste supremo titulo',
    })

    const archiveUpdated = boxUpdated.archives.find(
      (a) => a.archive.id === 'teste1',
    )

    expect(archiveUpdated?.archive.description).toEqual('teste superemo')
    expect(archiveUpdated?.archive.title).toEqual('teste supremo titulo')
  })

  it("Should not be able to update archive if archive don't existes", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        name: 'teste',
        age: 'teste',
        email: 'teste@test.com',
        password: 'teste',
        sex: 'teste',
        username: 'teste',
      })

      const box = await boxesRepositoryInMemory.create({
        internal: false,
        name: 'test box',
        tags: [{ name: 'test' }],
        userId: user!.id,
      })

      await updateArchiveUseCase.execute({
        boxId: box!.id,
        archiveId: 'teste1',
        description: 'teste superemo',
        title: 'teste supremo titulo',
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })

  it("Should not be able to update archive if box don't existes", async () => {
    expect(async () => {
      await updateArchiveUseCase.execute({
        boxId: 'inexistent id',
        archiveId: 'teste1',
        description: 'teste superemo',
        title: 'teste supremo titulo',
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
