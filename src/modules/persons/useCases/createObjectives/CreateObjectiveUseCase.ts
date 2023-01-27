import { container, inject, injectable } from 'tsyringe'

import { ICreateObjectiveDTO } from '@modules/persons/dtos/ICreateObjectiveDTO'
import { Objective } from '@modules/persons/infra/mongoose/entities/Objective'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { ITag } from '@modules/projects/infra/mongoose/entities/Tag'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { TagsToProject } from '@modules/projects/services/tags/TagsToProject'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  userId: string
  projectId: string
  personId: string
  objective: ICreateObjectiveDTO
}

interface IResponse {
  person: IPersonMongo
  project: IProjectMongo
}

@injectable()
export class CreateObjectiveUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute({
    objective,
    personId,
    projectId,
    userId,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

    if (!person) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Parece que esse personagem não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project } = await permissionToEditProject.verify(
      userId,
      projectId || person.defaultProject,
      'edit',
    )

    const objectiveExistesToThiPerson = person.objectives.find(
      (o) => o.title === objective.title,
    )
    if (objectiveExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe um objetivo com esse nome.',
        message:
          'Já existe um objetivo com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

    const tagObjectives = project.tags.find(
      (tag) => tag.type === 'persons/objectives',
    )
    const objectiveAlreadyExistsInTags = tagObjectives?.refs.find(
      (ref) => ref.object.title === objective.title,
    )
    if (objectiveAlreadyExistsInTags) {
      throw new AppError({
        title: 'Objetivo já existe nas tags.',
        message:
          'Você já criou um objetivo com esse nome para outro personagem... Caso o objetivo seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para o objetivo.',
        statusCode: 409,
      })
    }

    const newObjective = new Objective({
      avoiders: objective.avoiders,
      description: objective.description,
      objectified: objective.objectified,
      supporting: objective.supporting,
      title: objective.title,
    })

    const updatedObjetives = [newObjective, ...person.objectives]
    const updatedPerson = await this.personsRepository.updateObjectives(
      personId,
      updatedObjetives,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/objectives',
      [newObjective],
      [personId],
      project.name,
    )

    const updatedProject = await this.projectsRepository.updateTag(
      projectId || person.defaultProject,
      tags,
    )

    return { person: updatedPerson, project: updatedProject }
  }
}
