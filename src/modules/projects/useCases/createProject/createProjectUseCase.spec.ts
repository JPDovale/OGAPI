import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
import { type IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { type ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { type IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { CreateProjectUseCase } from '@modules/projects/useCases/createProject/createProjectUseCase'

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
      createdPerUser: user.id,
      users: [],
      plot: {},
    }

    const newProject = await createProjectUseCase.execute({
      project: newProjectTest,
      user: {
        id: user.id,
      },
    })

    expect(newProject).toHaveProperty('id')
  })
})
