import { inject, injectable } from 'tsyringe'

import { type IResponseCommentPlotProjectDTO } from '@modules/projects/dtos/IResponseCommentPlotProjectDTO'
import {
  type Comment,
  type IComment,
  Response,
} from '@modules/projects/infra/mongoose/entities/Comment'
import { type IPlotProject } from '@modules/projects/infra/mongoose/entities/Plot'
import { type IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorProjectNotUpdate } from '@shared/errors/projects/makeErrorProjectNotUpdate'
import { makeErrorCommentNotFound } from '@shared/errors/useFull/makeErrorCommentNotFound'

@injectable()
export class ResponseCommentPlotProjectUseCase {
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
    commentId: string,
    response: IResponseCommentPlotProjectDTO,
  ): Promise<IProjectMongo> {
    const { content } = response

    const { project, user } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'comment',
    })

    const newResponse = new Response({
      content,
      userId,
      username: user.username,
    })

    const comment = project.plot.comments.find(
      (comment: Comment) => comment.id === commentId,
    )
    const filteredComments = project.plot.comments.filter(
      (comment: Comment) => comment.id !== commentId,
    )

    if (!comment) throw makeErrorCommentNotFound()

    const updatedComment: IComment = {
      ...comment,
      responses: [newResponse, ...comment.responses],
    }

    const updatedPlot: IPlotProject = {
      ...project.plot,
      comments: [updatedComment, ...filteredComments],
    }

    const updatedProject = await this.projectsRepository.updatePlot(
      projectId,
      updatedPlot,
    )

    if (!updatedProject) throw makeErrorProjectNotUpdate()

    if (newResponse.userId !== comment.userId) {
      await this.notifyUsersProvider.notify(
        user,
        project,
        `${user.username} respondeu o comentário em ${comment.to}`,
        `${user.username} acabou de responder o comentário "${comment.content}" em ${comment.to}: ${newResponse.content}`,
      )
    } else {
      await this.notifyUsersProvider.notify(
        user,
        project,
        `${user.username} respondeu o próprio comentário em ${comment.to}`,
        `${user.username} acabou de responder o próprio comentário "${comment.content}" em ${comment.to}: ${newResponse.content}`,
      )
    }

    return updatedProject
  }
}
