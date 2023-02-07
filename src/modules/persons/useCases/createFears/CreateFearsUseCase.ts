import { container, inject, injectable } from 'tsyringe'

import { ICreateGenericObjectDTO } from '@modules/persons/dtos/ICreateGenericObjectDTO'
import { Fear } from '@modules/persons/infra/mongoose/entities/Fear'
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
  fear: ICreateGenericObjectDTO
}

interface IResponse {
  person: IPersonMongo
  project: IProjectMongo
}

@injectable()
export class CreateFearUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute({
    userId,
    projectId,
    personId,
    fear,
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

    const fearExistesToThiPerson = person.fears.find(
      (f) => f.title === fear.title,
    )
    if (fearExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe um medo com esse nome.',
        message:
          'Já existe um medo com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

    const tagFears = project.tags.find((tag) => tag.type === 'persons/fears')

    const fearAlreadyExistsInTags = tagFears?.refs.find(
      (ref) => ref.object.title === fear.title,
    )
    if (fearAlreadyExistsInTags) {
      throw new AppError({
        title: 'Medo já existe nas tags.',
        message:
          'Você já criou um medo com esse nome para outro personagem... Caso o medo seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para o medo.',
        statusCode: 409,
      })
    }

    const newFear = new Fear({
      description: fear.description,
      title: fear.title,
    })

    const updatedFears = [newFear, ...person.fears]
    const updatedPerson = await this.personsRepository.updateFears(
      personId,
      updatedFears,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/fears',
      [newFear],
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
