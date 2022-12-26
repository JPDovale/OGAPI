import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { PlotProject } from '@modules/projects/infra/mongoose/entities/Plot'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  user: {
    id: string
  }
  project: {
    name: string
    type: 'book' | 'rpg' | 'roadMap' | 'gameplay'
    private: boolean
    password?: string
  }
}

@injectable()
export class CreateProjectUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(request: IRequest): Promise<IProjectMongo> {
    const { user, project } = request
    const { id } = user
    const { name, private: priv, type, password } = project

    if (
      type !== 'rpg' &&
      type !== 'book' &&
      type !== 'gameplay' &&
      type !== 'roadMap'
    ) {
      throw new AppError('Type of project is invalid', 401)
    }

    const infoUser = await this.usersRepository.findById(id)

    const newProject = await this.projectsRepository.create({
      name,
      private: priv,
      type,
      password,
      createdPerUser: id,
      users: [
        {
          id,
          permission: 'edit',
          email: infoUser.email,
          username: infoUser.username,
        },
      ],
      plot: new PlotProject({}),
    })

    return newProject
  }
}
