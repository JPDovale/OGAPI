import { container, inject, injectable } from 'tsyringe'

import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { INotifyUsersProvider } from '@shared/container/provides/NotifyUsersProvider/INotifyUsersProvider'
import { IStorageProvider } from '@shared/container/provides/StorageProvider/IStorageProvider'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class DeleteImageUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
  ) {}

  async execute(userId: string, projectId: string): Promise<IProjectMongo> {
    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project, user } = await permissionToEditProject.verify(
      userId,
      projectId,
      'edit',
    )

    if (!project?.image.fileName) {
      throw new AppError({
        title: 'Image não encontrada.',
        message: 'Não existe uma imagem para esse projeto.',
        statusCode: 404,
      })
    }

    const updatedProject = await this.projectsRepository.updateImage(
      {
        fileName: '',
        url: '',
        updatedAt: this.dateProvider.getDate(new Date()),
        createdAt: project.image.createdAt,
      },
      projectId,
    )

    await this.storageProvider.delete(project.image.fileName, 'projects/images')

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} deletou a imagem do projeto.`,
      `${user.username} acabou de alterar a imagem do projeto: ${project.name} `,
    )

    return updatedProject
  }
}
