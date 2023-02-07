import { container, inject, injectable } from 'tsyringe'

import { ICreateGenericObjectWithConsequencesDTO } from '@modules/persons/dtos/ICreateGenericObjectWithConsequencesDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { Trauma } from '@modules/persons/infra/mongoose/entities/Trauma'
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
  trauma: ICreateGenericObjectWithConsequencesDTO
}

interface IResponse {
  person: IPersonMongo
  project: IProjectMongo
}
@injectable()
export class CreateTraumaUseCase {
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
    trauma,
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

    const traumaExistesToThiPerson = person.traumas.find(
      (t) => t.title === trauma.title,
    )
    if (traumaExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe um trauma com esse nome.',
        message:
          'Já existe um trauma com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

    const tagTrauma = project.tags.find((tag) => tag.type === 'persons/traumas')

    const traumaAlreadyExistsInTags = tagTrauma?.refs.find(
      (ref) => ref.object.title === trauma.title,
    )
    if (traumaAlreadyExistsInTags) {
      throw new AppError({
        title: 'Trauma já existe nas tags.',
        message:
          'Você já criou um trauma com esse nome para outro personagem... Caso o trauma seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para o trauma.',
        statusCode: 409,
      })
    }

    const newTrauma = new Trauma({
      title: trauma.title,
      consequences: trauma.consequences || [],
      description: trauma.description,
    })

    const updateTraumas = [newTrauma, ...person.traumas]
    const updatedPerson = await this.personsRepository.updateTraumas(
      personId,
      updateTraumas,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/traumas',
      [newTrauma],
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
