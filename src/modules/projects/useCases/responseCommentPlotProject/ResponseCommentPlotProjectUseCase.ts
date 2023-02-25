import { inject, injectable } from 'tsyringe'

import { IResponseCommentPlotProjectDTO } from '@modules/projects/dtos/IResponseCommentPlotProjectDTO'
import {
  Comment,
  IComment,
  Response,
} from '@modules/projects/infra/mongoose/entities/Comment'
import { IPlotProject } from '@modules/projects/infra/mongoose/entities/Plot'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'

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

    const comment: IComment = project.plot.comments.find(
      (comment: Comment) => comment.id === commentId,
    )
    const filteredComments = project.plot.comments.filter(
      (comment: Comment) => comment.id !== commentId,
    ) as Comment[]

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

    if (newResponse.userId !== comment.userId) {
      await this.notifyUsersProvider.notify(
        user,
        project,
        `${user.username} respondeu o comentário em ${comment.to}`,
        `${user.username} acabou de responder o comentário "${comment.content}" em ${comment.to}: ${newResponse.content}`,
      )

      // const userToNotify = await this.usersRepository.findById(comment.userId)

      // const newNotification = new Notification({
      //   title: `${user.username} respondeu seu comentário`,
      //   content: `${user.username} respondeu seu comentário em |${comment.to}: ${newResponse.content}`,
      //   projectId: project.id,
      //   sendedPerUser: user.id,
      // })

      // const notificationsUpdated = [
      //   newNotification,
      //   ...userToNotify.notifications,
      // ]

      // await this.usersRepository.updateNotifications(
      //   userToNotify.id,
      //   notificationsUpdated,
      // )
    } else {
      await this.notifyUsersProvider.notify(
        user,
        project,
        `${user.username} respondeu o próprio comentário em ${comment.to}`,
        `${user.username} acabou de responder o próprio comentário "${comment.content}" em ${comment.to}: ${newResponse.content}`,
      )
      // const responses = updatedComment.responses.filter(
      //   (response) => response.userId !== comment.userId,
      // )
      // const usersToNotify = responses.filter(
      //   (response, i, self) => i === self.indexOf(response),
      // )

      // await Promise.all(
      //   usersToNotify.map(async (u) => {
      //     const userToNotify = await this.usersRepository.findById(u.userId)

      //     const newNotification = new Notification({
      //       title: `${user.username} respondeu ao próprio comentário`,
      //       content: `${user.username} respondeu ao próprio comentário em |${comment.to}: ${newResponse.content}`,
      //       projectId: project.id,
      //       sendedPerUser: user.id,
      //     })

      //     const notificationsUpdated = [
      //       newNotification,
      //       ...userToNotify.notifications,
      //     ]

      //     await this.usersRepository.updateNotifications(
      //       userToNotify.id,
      //       notificationsUpdated,
      //     )
      //   }),
      // )
    }

    return updatedProject
  }
}
