import { inject, injectable } from 'tsyringe'

import { ICommentPlotProjectDTO } from '@modules/projects/dtos/ICommentPlotProjectDTO'
import { Comment } from '@modules/projects/infra/mongoose/entities/Comment'
import { IPlotProject } from '@modules/projects/infra/mongoose/entities/Plot'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { INotifyUsersProvider } from '@shared/container/provides/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'

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

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} comentou.`,
      `${user.username} comentou no projeto ${project.name} em |${newComment.to}: ${newComment.content}`,
    )

    return updatedProject
  }
}
