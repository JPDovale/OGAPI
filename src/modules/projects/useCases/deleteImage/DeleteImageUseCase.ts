import { inject, injectable } from 'tsyringe'

import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
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
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(userId: string, projectId: string): Promise<IProjectMongo> {
    const { project, user } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

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
