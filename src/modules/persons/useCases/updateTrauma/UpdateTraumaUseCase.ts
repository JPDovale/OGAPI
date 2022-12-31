import { container, inject, injectable } from 'tsyringe'

import { IUpdateTraumaDTO } from '@modules/persons/dtos/IUpdateTraumaDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { ITrauma } from '@modules/persons/infra/mongoose/entities/Trauma'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { TagsToProject } from '@modules/projects/services/tags/TagsToProject'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class UpdateTraumaUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectRepository: IProjectsRepository,
  ) {}

  async execute(
    userId: string,
    personId: string,
    traumaId: string,
    trauma: IUpdateTraumaDTO,
  ): Promise<IPersonMongo> {
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

    const filteredTrauma = person.traumas.filter(
      (trauma) => trauma.id !== traumaId,
    )
    const traumaToUpdate = person.traumas.find(
      (trauma) => trauma.id === traumaId,
    )

    const updatedTrauma: ITrauma = {
      ...traumaToUpdate,
      ...trauma,
    }

    const updateTrauma = [...filteredTrauma, updatedTrauma]

    const updatedPerson = await this.personsRepository.updateTraumas(
      personId,
      updateTrauma,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.updatePersonsTagsObject(
      'persons/traumas',
      traumaId,
      trauma,
      project.tags,
    )

    await this.projectRepository.updateTag(project.id, tags)

    return updatedPerson
  }
}
