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
    const { user, project } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    const updatedProject = await this.projectsRepository.update({
      projectId,
      data: {
        ambient:
          plot.ambient === null
            ? null
            : plot.ambient
            ? plot.ambient
            : project.ambient,
        count_time:
          plot.countTime === null
            ? null
            : plot.countTime
            ? plot.countTime
            : project.count_time,
        details:
          plot.details === null
            ? null
            : plot.details
            ? plot.details
            : project.details,
        historical_fact:
          plot.historicalFact === null
            ? null
            : plot.historicalFact
            ? plot.historicalFact
            : project.historical_fact,
        literary_genre:
          plot.literaryGenre === null
            ? null
            : plot.literaryGenre
            ? plot.literaryGenre
            : project.literary_genre,
        one_phrase:
          plot.onePhrase === null
            ? null
            : plot.onePhrase
            ? plot.onePhrase
            : project.one_phrase,
        premise:
          plot.premise === null
            ? null
            : plot.premise
            ? plot.premise
            : project.premise,
        storyteller:
          plot.storyteller === null
            ? null
            : plot.storyteller
            ? plot.storyteller
            : project.storyteller,
        structure_act_1:
          plot.structure?.act1 === null
            ? null
            : plot.structure?.act1
            ? plot.structure?.act1
            : project.structure_act_1,
        structure_act_2:
          plot.structure?.act2 === null
            ? null
            : plot.structure?.act2
            ? plot.structure?.act2
            : project.structure_act_2,
        structure_act_3:
          plot.structure?.act3 === null
            ? null
            : plot.structure?.act3
            ? plot.structure?.act3
            : project.structure_act_3,
        subgenre:
          plot.subgenre === null
            ? null
            : plot.subgenre
            ? plot.subgenre
            : project.subgenre,
        summary:
          plot.summary === null
            ? null
            : plot.summary
            ? plot.summary
            : project.summary,
        url_text:
          plot.urlOfText === null
            ? null
            : plot.urlOfText
            ? plot.urlOfText
            : project.url_text,
      },
    })

    if (!updatedProject) throw makeErrorProjectNotUpdate()

    await this.notifyUsersProvider.notifyUsersInOneProject({
      project: updatedProject,
      creatorId: user.id,
      title: `${user.username} alterou o plot do projeto.`,
      content: `${user.username} acabou de alterar o plot do projeto ${updatedProject.name}`,
    })

    return { project: updatedProject }
  }
}
