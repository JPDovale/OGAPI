import { container, inject, injectable } from 'tsyringe'

import { ICreateGenericObjectWithConsequencesDTO } from '@modules/persons/dtos/ICreateGenericObjectWithConsequencesDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { Personality } from '@modules/persons/infra/mongoose/entities/Personality'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { TagsToProject } from '@modules/projects/services/tags/TagsToProject'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  userId: string
  projectId: string
  personId: string
  personality: ICreateGenericObjectWithConsequencesDTO
}

interface IResponse {
  person: IPersonMongo
  project: IProjectMongo
}

@injectable()
export class CreatePersonalityUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute({
    personId,
    personality,
    projectId,
    userId,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

    if (!person)
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Parece que esse personagem não existe na nossa base de dados',
        statusCode: 404,
      })

    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project } = await permissionToEditProject.verify(
      userId,
      projectId || person.defaultProject,
      'edit',
    )

    const personalityExistesToThiPerson = person.personality.find(
      (p) => p.title === personality.title,
    )
    if (personalityExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe uma característica de personalidade com esse nome.',
        message:
          'Já existe uma característica de personalidade com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

    const tagPersonality = project.tags.find(
      (tag) => tag.type === 'persons/personality',
    )

    const personalityAlreadyExistsInTags = tagPersonality?.refs.find(
      (ref) => ref.object.title === personality.title,
    )
    if (personalityAlreadyExistsInTags) {
      throw new AppError({
        title: 'Característica de personalidade já existe nas tags.',
        message:
          'Você já criou uma característica de personalidade com esse nome para outro personagem... Caso o medo seja a mesma característica de personalidade, tente atribui-la ao personagem, ou então escolha outro nome para a característica de personalidade.',
        statusCode: 409,
      })
    }

    const newPersonality = new Personality({
      title: personality.title,
      consequences: personality.consequences || [],
      description: personality.description,
    })

    const updatePersonality = [newPersonality, ...person.personality]
    const updatedPerson = await this.personsRepository.updatePersonality(
      personId,
      updatePersonality,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/personality',
      [newPersonality],
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
