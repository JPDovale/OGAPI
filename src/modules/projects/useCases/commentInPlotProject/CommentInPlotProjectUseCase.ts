import { inject, injectable } from 'tsyringe'

import { type ICommentPlotProjectDTO } from '@modules/projects/dtos/ICommentPlotProjectDTO'
import { Comment } from '@modules/projects/infra/mongoose/entities/Comment'
import { type IPlotProject } from '@modules/projects/infra/mongoose/entities/Plot'
import { type IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorProjectNotUpdate } from '@shared/errors/projects/makeErrorProjectNotUpdate'

@injectable()
export class CommentInPlotProjectUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    projectId: string,
    comment: ICommentPlotProjectDTO,
  ): Promise<IProjectMongo> {
    const { content, to } = comment

    const { project, user } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'comment',
    })

    const newComment = new Comment({
      content,
      to,
      userId,
      username: user.username,
    })

    const plotUpdated: IPlotProject = {
      ...project.plot,
      comments: [{ ...newComment }, ...project.plot.comments],
    }

    const updatedProject = await this.projectsRepository.updatePlot(
      projectId,
      plotUpdated,
    )

    if (!updatedProject) throw makeErrorProjectNotUpdate()

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} comentou.`,
      `${user.username} comentou no projeto ${project.name} em |${newComment.to}: ${newComment.content}`,
    )

    return updatedProject
  }
}
