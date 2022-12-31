import { container, inject, injectable } from 'tsyringe'

import { Notification } from '@modules/accounts/infra/mongoose/entities/Notification'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IResponseCommentPlotProjectDTO } from '@modules/projects/dtos/IResponseCommentPlotProjectDTO'
import {
  Comment,
  Response,
} from '@modules/projects/infra/mongoose/entities/Comment'
import { IPlotProject } from '@modules/projects/infra/mongoose/entities/Plot'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'

@injectable()
export class ResponseCommentPlotProjectUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
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

    if (newResponse.userId !== comment.userId) {
      const userToNotify = await this.usersRepository.findById(comment.userId)

      const newNotification = new Notification({
        title: `${user.username} respondeu seu comentário`,
        content: `${user.username} respondeu seu comentário em |${comment.to}: ${newResponse.content}`,
      })

      const notificationsUpdated = [
        newNotification,
        ...userToNotify.notifications,
      ]

      await this.usersRepository.updateNotifications(
        userToNotify.id,
        notificationsUpdated,
      )
    } else {
      const responses = updatedComment.responses.filter(
        (response) => response.userId !== comment.userId,
      )
      const usersToNotify = responses.filter(
        (response, i, self) => i === self.indexOf(response),
      )

      await Promise.all(
        usersToNotify.map(async (u) => {
          const userToNotify = await this.usersRepository.findById(u.userId)

          const newNotification = new Notification({
            title: `${user.username} respondeu ao próprio comentário`,
            content: `${user.username} respondeu ao próprio comentário em |${comment.to}: ${newResponse.content}`,
          })

          const notificationsUpdated = [
            newNotification,
            ...userToNotify.notifications,
          ]

          await this.usersRepository.updateNotifications(
            userToNotify.id,
            notificationsUpdated,
          )
        }),
      )
    }

    const updatedPlot: IPlotProject = {
      ...project.plot,
      comments: [updatedComment, ...filteredComments],
    }

    await this.projectsRepository.updatePlot(projectId, updatedPlot)
  }
}
