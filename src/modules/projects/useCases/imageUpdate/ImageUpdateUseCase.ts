import fs from 'fs'
import { container, inject, injectable } from 'tsyringe'

import {
  Avatar,
  IAvatar,
} from '@modules/accounts/infra/mongoose/entities/Avatar'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class ImageUpdateUseCase {
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

  async execute(
    userId: string,
    projectId: string,
    file: Express.Multer.File,
  ): Promise<IProjectMongo> {
    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project, user } = await permissionToEditProject.verify(
      userId,
      projectId,
      'edit',
    )

    if (project?.image?.fileName) {
      await this.storageProvider.delete(
        project.image.fileName,
        'projects/images',
      )
    }

    const url = await this.storageProvider.upload(file, 'projects/images')
    let imageToUpdate: IAvatar

    if (project.image.fileName) {
      const image: IAvatar = {
        ...project.image,
        fileName: file.filename,
        url,
        updatedAt: this.dateProvider.getDate(new Date()),
      }

      imageToUpdate = image
    } else {
      const image = new Avatar({
        fileName: file.filename,
        url,
      })

      imageToUpdate = image
    }

    const updatedProject = await this.projectsRepository.updateImage(
      imageToUpdate,
      projectId,
    )
    fs.rmSync(file.path)

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} alterou a imagem do projeto.`,
      `${user.username} acabou de alterar a imagem do projeto: ${project.name} `,
    )

    return updatedProject
  }
}
