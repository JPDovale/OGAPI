import { container, inject, injectable } from 'tsyringe'

import { Notification } from '@modules/accounts/infra/mongoose/entities/Notification'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
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
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
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

    await Promise.all(
      project.users.map(async (u) => {
        if (u.id === newComment.userId) return
        const userToNotify = await this.usersRepository.findById(u.id)

        if (userToNotify) {
          const newNotification = new Notification({
            title: `${user.username} comentou`,
            content: `${user.username} comentou no projeto ${project.name} em |${newComment.to}: ${newComment.content}`,
          })

          const notificationsUpdated = [
            newNotification,
            ...userToNotify.notifications,
          ]

          await this.usersRepository.updateNotifications(
            userToNotify.id,
            notificationsUpdated,
          )
        }
      }),
    )

    await this.projectsRepository.updatePlot(projectId, plotUpdated)
  }
}
