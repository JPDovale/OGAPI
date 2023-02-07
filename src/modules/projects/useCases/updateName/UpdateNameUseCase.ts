import { container, inject, injectable } from 'tsyringe'

import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { INotifyUsersProvider } from '@shared/container/provides/NotifyUsersProvider/INotifyUsersProvider'

interface IRequest {
  userId: string
  projectId: string
  name: string
}

@injectable()
export class UpdateNameUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
  ) {}

  async execute({ projectId, name, userId }: IRequest): Promise<IProjectMongo> {
    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { user, project } = await permissionToEditProject.verify(
      userId,
      projectId,
      'edit',
    )

    const updatedProject = await this.projectsRepository.updateName({
      name,
      id: projectId,
    })

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} alterou o nome do projeto.`,
      `${user.username} acabou de alterar o nome do projeto: de ${project.name} para ${updatedProject.name}`,
    )

    return updatedProject
  }
}
