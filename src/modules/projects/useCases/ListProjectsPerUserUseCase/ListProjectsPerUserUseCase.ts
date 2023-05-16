import { inject, injectable } from 'tsyringe'

import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type IPreviewProject } from '@modules/projects/responses/IPreviewProject'
import InjectableDependencies from '@shared/container/types'
import { getFeatures } from '@utils/application/dataTransformers/projects/features'

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

    const projects: IPreviewProject[] = projectsThisUser.map((project) => ({
      ...project,
      features: getFeatures(project?.features_using),
    }))

    return {
      projects,
    }
  }
}
