import 'reflect-metadata'

import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { ICacheProvider } from '@shared/container/provides/CacheProvider/ICacheProvider'
import { RedisCacheProvider } from '@shared/container/provides/CacheProvider/implementations/RedisCacheProvider'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { DayJsDateProvider } from '@shared/container/provides/DateProvider/implementations/DayJsDateProvider'
import { NotifyUsersProvider } from '@shared/container/provides/NotifyUsersProvider/implementations/NotifyUsersProvider'
import { INotifyUsersProvider } from '@shared/container/provides/NotifyUsersProvider/INotifyUsersProvider'
import { VerifyPermissions } from '@shared/container/services/verifyPermissions/implementations/VerifyPermissions'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

import { UpdateNameUseCase } from './UpdateNameUseCase'

let projectsRepositoryInMemory: IProjectsRepository
let usersRepositoryInMemory: IUsersRepository

let dateProvider: IDateProvider
let cacheProvider: ICacheProvider
let notifyUsersProvider: INotifyUsersProvider

let verifyPermissionsService: IVerifyPermissionsService

let updateNameUseCase: UpdateNameUseCase

describe('Update name project', () => {
  beforeEach(() => {
    projectsRepositoryInMemory = new ProjectsRepositoryInMemory()
    usersRepositoryInMemory = new UserRepositoryInMemory()

    dateProvider = new DayJsDateProvider()
    cacheProvider = new RedisCacheProvider(dateProvider)
    notifyUsersProvider = new NotifyUsersProvider(
      usersRepositoryInMemory,
      cacheProvider,
    )

    verifyPermissionsService = new VerifyPermissions(
      projectsRepositoryInMemory,
      usersRepositoryInMemory,
    )

    updateNameUseCase = new UpdateNameUseCase(
      projectsRepositoryInMemory,
      notifyUsersProvider,
      verifyPermissionsService,
    )
  })

  it('should be able to update name of project', async () => {
    const user = await usersRepositoryInMemory.create({
      age: '2312',
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
    })

    const newProjectTest = await projectsRepositoryInMemory.create({
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
      ],
      plot: {},
    })

    await updateNameUseCase.execute({
      projectId: newProjectTest.id,
      name: 'teste 2',
      userId: user.id,
    })

    const projectWithNewName = await projectsRepositoryInMemory.findById(
      newProjectTest.id,
    )

    expect(projectWithNewName.name).toEqual('teste 2')
  })

  it("not should be able to update name if user doesn't permission", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        age: '2312',
        email: 'test@test.com',
        name: 'test',
        password: 'test',
        sex: 'male',
        username: 'test',
      })

      const user2 = await usersRepositoryInMemory.create({
        age: '2312',
        email: 'test2@test2.com',
        name: 'test2',
        password: 'test2',
        sex: 'male',
        username: 'test2',
      })

      const newProjectTest = await projectsRepositoryInMemory.create({
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
            permission: 'view',
          },
        ],
        plot: {},
      })

      await updateNameUseCase.execute({
        projectId: newProjectTest.id,
        name: 'teste 2',
        userId: user2.id,
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
