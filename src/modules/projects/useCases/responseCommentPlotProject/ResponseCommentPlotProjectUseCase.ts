import { container, inject, injectable } from 'tsyringe'

import { IResponseCommentPlotProjectDTO } from '@modules/projects/dtos/IResponseCommentPlotProjectDTO'
import {
  Comment,
  Response,
} from '@modules/projects/infra/mongoose/entities/Comment'
import {
  IPlotProject,
  PlotProject,
} from '@modules/projects/infra/mongoose/entities/Plot'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'

@injectable()
export class ResponseCommentPlotProjectUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute(
    userId: string,
    projectId: string,
    commentId: string,
    response: IResponseCommentPlotProjectDTO,
  ): Promise<void> {
    const { content } = response
    const permissionToComment = container.resolve(PermissionToEditProject)
    const { project, user } = await permissionToComment.verify(
      userId,
      projectId,
      'comment',
    )

    const newResponse = new Response({
      content,
      userId,
      username: user.username,
      userAvata: user.avatar,
    })

    const comment: Comment = project.plot.comments.find(
      (comment: Comment) => comment.id === commentId,
    )
    const filteredComments = project.plot.comments.filter(
      (comment: Comment) => comment.id !== commentId,
    ) as Comment[]

    const updatedComment: Comment = {
      ...comment,
      responses: [newResponse, ...comment.responses],
    }

    const updatedPlot: IPlotProject = {
      ...project.plot,
      comments: [updatedComment, ...filteredComments],
    }

    await this.projectsRepository.updatePlot(projectId, updatedPlot)
  }
}
