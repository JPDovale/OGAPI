import { inject, injectable } from 'tsyringe'

import { type IUpdatePlotDTO } from '@modules/projects/dtos/IUpdatePlotDTO'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type IProject } from '@modules/projects/infra/repositories/entities/IProject'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectNotUpdate } from '@shared/errors/projects/makeErrorProjectNotUpdate'

interface IRequest {
  plot: IUpdatePlotDTO
  userId: string
  projectId: string
}

interface IResponse {
  project: IProject
}

@injectable()
export class PlotUpdateUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({ plot, projectId, userId }: IRequest): Promise<IResponse> {
    const { project, user } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    const updatedProject = await this.projectsRepository.update({
      projectId,
      data: {
        ambient: plot.ambient,
        count_time: plot.countTime,
        details: plot.details,
        historical_fact: plot.historicalFact,
        literary_genre: plot.literaryGenre,
        one_phrase: plot.onePhrase,
        premise: plot.premise,
        storyteller: plot.storyteller,
        structure_act_1: plot.structure?.act1,
        structure_act_2: plot.structure?.act2,
        structure_act_3: plot.structure?.act3,
        subgenre: plot.subgenre,
        summary: plot.summary,
        url_text: plot.urlOfText,
      },
    })

    if (!updatedProject) throw makeErrorProjectNotUpdate()

    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      title: `${user.username} alterou o plot do projeto.`,
      content: `${user.username} acabou de alterar o plot do projeto ${project.name}`,
    })

    return { project: updatedProject }
  }
}
