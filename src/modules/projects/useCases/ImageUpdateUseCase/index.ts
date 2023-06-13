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
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

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

  async execute({
    file,
    projectId,
    userId,
  }: IRequest): Promise<IResolve<IResponse>> {
    if (!file) {
      return {
        ok: false,
        error: makeErrorFileNotUploaded(),
      }
    }
    const verification = await this.verifyPermissions.verify({
      projectId,
      userId,
      verifyPermissionTo: 'view',
    })

    if (verification.error) {
      return {
        ok: false,
        error: verification.error,
      }
    }

    const { project, user } = verification.data!

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
    if (!updatedProject) {
      return {
        ok: false,
        error: makeErrorProjectNotUpdate(),
      }
    }

    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      creatorId: user.id,
      title: `${user.username} alterou a imagem do projeto.`,
      content: `${user.username} acabou de alterar a imagem do projeto: ${project.name} `,
    })

    return {
      ok: true,
      data: {
        project: updatedProject,
      },
    }
  }
}
