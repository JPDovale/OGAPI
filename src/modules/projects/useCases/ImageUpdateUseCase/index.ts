import fs from 'fs'
import { inject, injectable } from 'tsyringe'

import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type IProject } from '@modules/projects/infra/repositories/entities/IProject'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectNotUpdate } from '@shared/errors/projects/makeErrorProjectNotUpdate'
import { makeErrorFileNotUploaded } from '@shared/errors/useFull/makeErrorFileNotUploaded'

interface IRequest {
  userId: string
  projectId: string
  file: Express.Multer.File | undefined
}

interface IResponse {
  project: IProject
}

@injectable()
export class ImageUpdateUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Providers.StorageProvider)
    private readonly storageProvider: IStorageProvider,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({ file, projectId, userId }: IRequest): Promise<IResponse> {
    if (!file) throw makeErrorFileNotUploaded()

    const { project, user } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    if (project.image_filename) {
      await this.storageProvider.delete(
        project.image_filename,
        'projects/images',
      )
    }

    const url = await this.storageProvider.upload(file, 'projects/images')

    const updatedProject = await this.projectsRepository.update({
      projectId,
      data: {
        image_filename: file.filename,
        image_url: url,
      },
    })

    fs.rmSync(file.path)
    if (!updatedProject) throw makeErrorProjectNotUpdate()

    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      creatorId: user.id,
      title: `${user.username} alterou a imagem do projeto.`,
      content: `${user.username} acabou de alterar a imagem do projeto: ${project.name} `,
    })

    return { project: updatedProject }
  }
}
