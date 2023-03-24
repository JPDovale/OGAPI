import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { PlotProject } from '@modules/projects/infra/mongoose/entities/Plot'
import { type IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { makeErrorProjectNotCreated } from '@shared/errors/projects/makeErrorProjectNotCreated'
import { makeErrorLimitFreeInEnd } from '@shared/errors/useFull/makeErrorLimitFreeInEnd'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

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

    const infoUser = await this.usersRepository.findById(id)
    if (!infoUser) throw makeErrorUserNotFound()

    const numberOfProjectsThisUser =
      await this.projectsRepository.getNumberOfProjectsByUserId(user.id)

    if (numberOfProjectsThisUser >= 2 && !infoUser.payed && !infoUser.admin)
      throw makeErrorLimitFreeInEnd()

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
        },
      ],
      plot: new PlotProject({}),
    })

    if (!newProject) throw makeErrorProjectNotCreated()

    return newProject
  }
}
