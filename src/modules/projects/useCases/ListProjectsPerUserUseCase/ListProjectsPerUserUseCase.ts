import { inject, injectable } from 'tsyringe'

import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type IPreviewProject } from '@modules/projects/responses/types/IPreviewProject'
import InjectableDependencies from '@shared/container/types'

interface IRequest {
  userId: string
}

interface IResponse {
  projects: IPreviewProject[]
}

@injectable()
export class ListProjectsPerUserUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute({ userId }: IRequest): Promise<IResponse> {
    const projectsThisUser =
      await this.projectsRepository.listProjectsOfOneUser(userId)

    return {
      projects: projectsThisUser,
    }
  }
}
