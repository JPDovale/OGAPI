import { container, inject, injectable } from 'tsyringe'

import { ICreateGenericObjectWithExceptionsDTO } from '@modules/persons/dtos/ICreateGenericObjectWithExceptionsDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { Value } from '@modules/persons/infra/mongoose/entities/Value'
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
  value: ICreateGenericObjectWithExceptionsDTO
}

interface IResponse {
  person: IPersonMongo
  project: IProjectMongo
}

@injectable()
export class CreateValueUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute({
    personId,
    projectId,
    userId,
    value,
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

    const valueExistesToThiPerson = person.values.find(
      (t) => t.title === value.title,
    )
    if (valueExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe um valor com esse nome.',
        message:
          'Já existe um valor com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

    const tagValues = project.tags.find((tag) => tag.type === 'persons/values')

    const valueAlreadyExistsInTags = tagValues?.refs.find(
      (ref) => ref.object.title === value.title,
    )
    if (valueAlreadyExistsInTags) {
      throw new AppError({
        title: 'Valor já existe nas tags.',
        message:
          'Você já criou um valor com esse nome para outro personagem... Caso o valor seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para o valor.',
        statusCode: 409,
      })
    }

    const newValue = new Value({
      description: value.description,
      title: value.title,
      exceptions: value.exceptions || [],
    })

    const updatedObjetives = [newValue, ...person.values]
    const updatedPerson = await this.personsRepository.updateValues(
      personId,
      updatedObjetives,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/values',
      [newValue],
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
