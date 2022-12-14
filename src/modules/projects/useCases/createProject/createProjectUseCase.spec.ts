import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'

import { CreateProjectUseCase } from './createProjectUseCase'

let projectsRepository: IProjectsRepository
let createProjectUseCase: CreateProjectUseCase

describe('Create new project', () => {
  beforeEach(() => {
    projectsRepository = new ProjectsRepositoryInMemory()
    createProjectUseCase = new CreateProjectUseCase(projectsRepository)
  })

  it('shout be able crete an new project', async () => {
    const newProjectTest: ICreateProjectDTO = {
      name: 'test',
      private: false,
      type: 'book',
      createdPerUser: '123213412',
    }

    const newProject = await createProjectUseCase.execute({
      project: { ...newProjectTest },
      user: {
        id: newProjectTest.createdPerUser,
      },
    })

    expect(newProject).toHaveProperty('id')
  })
})
