import { inject, injectable } from 'tsyringe'

import { IUpdatePlotDTO } from '@modules/projects/dtos/IUpdatePlotDTO'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { INotifyUsersProvider } from '@shared/container/provides/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'

@injectable()
export class PlotUpdateUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    plot: IUpdatePlotDTO,
    userId: string,
    projectId: string,
  ): Promise<IProjectMongo> {
    const { project, user } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    const updatedPlot: IUpdatePlotDTO = { ...project.plot, ...plot }

    const updatedProject = await this.projectsRepository.updatePlot(
      projectId,
      updatedPlot,
    )

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} alterou o plot do projeto.`,
      `${user.username} acabou de alterar o plot do projeto ${project.name}`,
    )

    return updatedProject
  }
}
