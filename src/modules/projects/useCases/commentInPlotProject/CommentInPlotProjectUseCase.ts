import { container, inject, injectable } from 'tsyringe'

import { ICommentPlotProjectDTO } from '@modules/projects/dtos/ICommentPlotProjectDTO'
import { Comment } from '@modules/projects/infra/mongoose/entities/Comment'
import { IPlotProject } from '@modules/projects/infra/mongoose/entities/Plot'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'

@injectable()
export class CommentInPlotProjectUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute(
    userId: string,
    projectId: string,
    comment: ICommentPlotProjectDTO,
  ): Promise<void> {
    const { content, to } = comment
    const permissionToComment = container.resolve(PermissionToEditProject)
    const { project, user } = await permissionToComment.verify(
      userId,
      projectId,
      'comment',
    )

    const newComment = new Comment({
      content,
      to,
      userId,
      username: user.username,
      userAvata: user.avatar,
    })

    const plotUpdated: IPlotProject = {
      ...project.plot,
      comments: [newComment, ...project.plot.comments],
    }

    await this.projectsRepository.updatePlot(projectId, plotUpdated)
  }
}
