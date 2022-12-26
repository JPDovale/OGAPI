import { container, inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { TagsToProject } from '@modules/projects/services/tags/TagsToProject'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class DeleteDreamUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectRepository: IProjectsRepository,
  ) {}

  async execute(
    userId: string,
    personId: string,
    dreamId: string,
  ): Promise<void> {
    const person = await this.personsRepository.findById(personId)
    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project } = await permissionToEditProject.verify(
      userId,
      person.defaultProject,
      'edit',
    )

    if (!person) {
      throw new AppError('O personagem não existe', 404)
    }

    if (person.fromUser !== userId) {
      throw new AppError(
        'Você não tem permissão para apagar esse personagem, pois ele pertence a outro usuário',
        404,
      )
    }

    const filteredDreams = person.dreams.filter((dream) => dream.id !== dreamId)

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.deleteReferenceTag(
      'persons/dreams',
      dreamId,
      personId,
      project.tags,
    )

    await this.projectRepository.updateTag(project.id, tags)

    await this.personsRepository.updateDreams(personId, filteredDreams)
  }
}
