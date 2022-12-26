import { container, inject, injectable } from 'tsyringe'

import { IUpdatePlotDTO } from '@modules/projects/dtos/IUpdatePlotDTO'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class PlotUpdateUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute(
    plot: IUpdatePlotDTO,
    userId: string,
    projectId: string,
  ): Promise<IProjectMongo> {
    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project } = await permissionToEditProject.verify(
      userId,
      projectId,
      'edit',
    )

    const updatedPlot: IUpdatePlotDTO = { ...project.plot, ...plot }

    const updatedProject = await this.projectsRepository.updatePlot(
      projectId,
      updatedPlot,
    )

    return updatedProject
  }
}
