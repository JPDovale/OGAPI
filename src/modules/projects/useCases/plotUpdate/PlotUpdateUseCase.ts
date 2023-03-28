import { inject, injectable } from 'tsyringe'

import { type IUpdatePlotDTO } from '@modules/projects/dtos/IUpdatePlotDTO'
import { type IPlotProject } from '@modules/projects/infra/mongoose/entities/Plot'
import { type IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorProjectNotUpdate } from '@shared/errors/projects/makeErrorProjectNotUpdate'

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

    const updatedPlot: IPlotProject = { ...project.plot, ...plot }

    const updatedProject = await this.projectsRepository.updatePlot(
      projectId,
      updatedPlot,
    )

    if (!updatedProject) throw makeErrorProjectNotUpdate()

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} alterou o plot do projeto.`,
      `${user.username} acabou de alterar o plot do projeto ${project.name}`,
    )

    return updatedProject
  }
}
