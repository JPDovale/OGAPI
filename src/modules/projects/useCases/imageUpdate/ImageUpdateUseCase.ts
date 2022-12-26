import fs from 'fs'
import { container, inject, injectable } from 'tsyringe'

import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { IStorageProvider } from '@shared/container/provides/StorageProvider/IStorageProvider'

@injectable()
export class ImageUpdateUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute(
    userId: string,
    projectId: string,
    file: Express.Multer.File,
  ): Promise<void> {
    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project } = await permissionToEditProject.verify(
      userId,
      projectId,
      'edit',
    )

    if (project.image) {
      const destruct = project.image.split('F')[2]
      const filename = destruct.split('?')[0]
      await this.storageProvider.delete(filename, 'projects/images')
    }

    const url = await this.storageProvider.upload(file, 'projects/images')

    await this.projectsRepository.updateImage(url, projectId)
    fs.rmSync(file.path)
  }
}
