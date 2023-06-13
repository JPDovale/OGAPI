import { inject, injectable } from 'tsyringe'

import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type IProject } from '@modules/projects/infra/repositories/entities/IProject'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectNotUpdate } from '@shared/errors/projects/makeErrorProjectNotUpdate'
import { makeErrorImageNotFound } from '@shared/errors/useFull/makeErrorImageNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  projectId: string
}

interface IResponse {
  project: IProject
}

@injectable()
export class DeleteImageUseCase {
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

  async execute({ projectId, userId }: IRequest): Promise<IResolve<IResponse>> {
    const verification = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    if (verification.error) {
      return {
        ok: false,
        error: verification.error,
      }
    }

    const { project, user } = verification.data!

    if (!project.image_filename) {
      return {
        ok: false,
        error: makeErrorImageNotFound(),
      }
    }

    const updatedProject = await this.projectsRepository.update({
      projectId,
      data: {
        image_filename: null,
        image_url: null,
      },
    })

    if (!updatedProject) {
      return {
        ok: false,
        error: makeErrorProjectNotUpdate(),
      }
    }

    await this.storageProvider.delete(project.image_filename, 'projects/images')
    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      creatorId: user.id,
      title: `${user.username} deletou a imagem do projeto.`,
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
