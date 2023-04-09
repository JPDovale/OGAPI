import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { type IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { CreateProjectUseCase } from '@modules/projects/useCases/createProject/createProjectUseCase'
import { AppError } from '@shared/errors/AppError'

import { PlotProject } from './../../infra/mongoose/entities/Plot'

let projectsRepository: IProjectsRepository
let createProjectUseCase: CreateProjectUseCase
let usersRepository: IUsersRepository

describe('Create new project', () => {
  beforeEach(() => {
    projectsRepository = new ProjectsRepositoryInMemory()
    usersRepository = new UserRepositoryInMemory()
    createProjectUseCase = new CreateProjectUseCase(
      projectsRepository,
      usersRepository,
    )
  })

  it('shout be able crete an new project', async () => {
    const user = await usersRepository.create({
      age: '2312',
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
    })

    const newProjectTest: ICreateProjectDTO = {
      name: 'test',
      private: false,
      type: 'book',
      createdPerUser: user!.id,
      users: [],
      plot: new PlotProject({}),
    }

    const newProject = await createProjectUseCase.execute({
      project: newProjectTest,
      user: {
        id: user!.id,
      },
    })

    expect(newProject).toHaveProperty('id')
  })

  it('should no be able crete an new project if limit free expires', async () => {
    expect(async () => {
      const user = await usersRepository.create({
        age: '2312',
        email: 'test@test.com',
        name: 'test',
        password: 'test',
        sex: 'male',
        username: 'test',
      })

      const newProjectTest: ICreateProjectDTO = {
        name: 'test',
        private: false,
        type: 'book',
        createdPerUser: user!.id,
        users: [],
        plot: new PlotProject({}),
      }

      await projectsRepository.create(newProjectTest)
      await projectsRepository.create(newProjectTest)

      await createProjectUseCase.execute({
        project: newProjectTest,
        user: {
          id: user!.id,
        },
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })

  it('shout be able crete more then 2 projects if user payed', async () => {
    const user = await usersRepository.create({
      age: '2312',
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
      payed: true,
    })

    const newProjectTest: ICreateProjectDTO = {
      name: 'test',
      private: false,
      type: 'book',
      createdPerUser: user!.id,
      users: [],
      plot: new PlotProject({}),
    }

    await projectsRepository.create(newProjectTest)
    await projectsRepository.create(newProjectTest)

    const newProject = await createProjectUseCase.execute({
      project: newProjectTest,
      user: {
        id: user!.id,
      },
    })

    expect(newProject).toHaveProperty('id')
  })

  it('shout be able crete more then 2 projects if user is admin', async () => {
    const user = await usersRepository.create({
      age: '2312',
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      sex: 'male',
      username: 'test',
      payed: false,
      admin: true,
    })

    const newProjectTest: ICreateProjectDTO = {
      name: 'test',
      private: false,
      type: 'book',
      createdPerUser: user!.id,
      users: [],
      plot: new PlotProject({}),
    }

    await projectsRepository.create(newProjectTest)
    await projectsRepository.create(newProjectTest)

    const newProject = await createProjectUseCase.execute({
      project: newProjectTest,
      user: {
        id: user!.id,
      },
    })

    expect(newProject).toHaveProperty('id')
  })
})
