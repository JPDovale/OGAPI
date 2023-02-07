import { container, inject, injectable } from 'tsyringe'

import { ICreateGenericObjectDTO } from '@modules/persons/dtos/ICreateGenericObjectDTO'
import { Dream } from '@modules/persons/infra/mongoose/entities/Dream'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
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
  dream: ICreateGenericObjectDTO
}

interface IResponse {
  person: IPersonMongo
  project: IProjectMongo
}

@injectable()
export class CreateDreamUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute({
    dream,
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

    const dreamExistesToThiPerson = person.dreams.find(
      (d) => d.title === dream.title,
    )

    if (dreamExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe um sonho com esse nome.',
        message:
          'Já existe um sonho com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

    const tagDreams = project.tags.find((tag) => tag.type === 'persons/dreams')

    const dreamAlreadyExistsInTags = tagDreams?.refs.find(
      (ref) => ref.object.title === dream.title,
    )

    if (dreamAlreadyExistsInTags) {
      throw new AppError({
        title: 'Sonho já existe nas tags.',
        message:
          'Você já criou um sonho com esse nome para outro personagem... Caso o sonho seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para o sonho.',
        statusCode: 409,
      })
    }

    const newDream = new Dream({
      description: dream.description,
      title: dream.title,
    })

    const updatedDreams = [newDream, ...person.dreams]
    const updatedPerson = await this.personsRepository.updateDreams(
      personId,
      updatedDreams,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/dreams',
      [newDream],
      [personId],
      project.name,
    )

    const projectUpdate = await this.projectsRepository.updateTag(
      projectId || person.defaultProject,
      tags,
    )

    return { person: updatedPerson, project: projectUpdate }
  }
}
