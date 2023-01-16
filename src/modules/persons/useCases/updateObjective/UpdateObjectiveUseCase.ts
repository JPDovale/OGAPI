import { container, inject, injectable } from 'tsyringe'

import { IUpdateObjectiveDTO } from '@modules/persons/dtos/IUpdateObjectiveDTO'
import { IObjective } from '@modules/persons/infra/mongoose/entities/Objective'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { TagsToProject } from '@modules/projects/services/tags/TagsToProject'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class UpdateObjectiveUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectRepository: IProjectsRepository,
  ) {}

  async execute(
    userId: string,
    personId: string,
    objectiveId: string,
    objective: IUpdateObjectiveDTO,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)
    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project, permission } = await permissionToEditProject.verify(
      userId,
      person.defaultProject,
      'edit',
    )

    if (!person) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Você está tentando atualizar um personagem que não existe.',
        statusCode: 404,
      })
    }

    if (permission !== 'edit') {
      throw new AppError({
        title: 'Você não tem permissão para atualizar o personagem',
        message: 'Você está tentando atualizar um personagem que não existe.',
        statusCode: 401,
      })
    }

    const filteredObjectives = person.objectives.filter(
      (objective) => objective.id !== objectiveId,
    )
    const objectiveToUpdate = person.objectives.find(
      (objective) => objective.id === objectiveId,
    )

    const updatedObjetive: IObjective = {
      ...objectiveToUpdate,
      ...objective,
    }

    const updatedObjetives = [...filteredObjectives, updatedObjetive]

    const updatedPerson = await this.personsRepository.updateObjectives(
      personId,
      updatedObjetives,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.updatePersonsTagsObject(
      'persons/objectives',
      objectiveId,
      { title: objective.title, description: objective.description },
      project.tags,
    )

    await this.projectRepository.updateTag(project.id, tags)

    return updatedPerson
  }
}
