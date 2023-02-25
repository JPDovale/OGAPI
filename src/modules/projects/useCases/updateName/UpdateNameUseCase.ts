import { inject, injectable } from 'tsyringe'

import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'

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
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({ projectId, name, userId }: IRequest): Promise<IProjectMongo> {
    const { user, project } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

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
