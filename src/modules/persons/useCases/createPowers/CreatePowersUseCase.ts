import { container, inject, injectable } from 'tsyringe'

import { ICreateGenericObjectDTO } from '@modules/persons/dtos/ICreateGenericObjectDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { Power } from '@modules/persons/infra/mongoose/entities/Power'
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
  power: ICreateGenericObjectDTO
}

interface IResponse {
  person: IPersonMongo
  project: IProjectMongo
}

@injectable()
export class CreatePowerUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute({
    personId,
    power,
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

    const powerExistesToThiPerson = person.powers.find(
      (p) => p.title === power.title,
    )
    if (powerExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe um poder com esse nome.',
        message:
          'Já existe um poder com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

    const tagPowers = project.tags.find((tag) => tag.type === 'persons/powers')

    const powerAlreadyExistsInTags = tagPowers?.refs.find(
      (ref) => ref.object.title === power.title,
    )
    if (powerAlreadyExistsInTags) {
      throw new AppError({
        title: 'Poder já existe nas tags.',
        message:
          'Você já criou um poder com esse nome para outro personagem... Caso o poder seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para o poder.',
        statusCode: 409,
      })
    }

    const newPower = new Power({
      description: power.description,
      title: power.title,
    })

    const updatedPowers = [newPower, ...person.powers]
    const updatedPerson = await this.personsRepository.updatePowers(
      personId,
      updatedPowers,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/powers',
      [newPower],
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
