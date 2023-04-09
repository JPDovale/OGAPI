import { inject, injectable } from 'tsyringe'

import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectNotUpdate } from '@shared/errors/projects/makeErrorProjectNotUpdate'

interface IRequest {
  userId: string
  projectId: string
  name: string
}

interface IResponse {
  projectName: string
}

@injectable()
export class UpdateNameUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({ projectId, name, userId }: IRequest): Promise<IResponse> {
    const { user, project } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    const updatedProject = await this.projectsRepository.update({
      projectId,
      data: {
        name,
      },
    })

    if (!updatedProject) throw makeErrorProjectNotUpdate()

    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      title: `${user.username} alterou o nome do projeto.`,
      content: `${user.username} acabou de alterar o nome do projeto: de ${project.name} para ${updatedProject.name}`,
    })

    return { projectName: name }
  }
}
