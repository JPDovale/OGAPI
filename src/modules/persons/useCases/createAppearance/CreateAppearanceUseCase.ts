import { container, inject, injectable } from 'tsyringe'

import { ICreateGenericObjectDTO } from '@modules/persons/dtos/ICreateGenericObjectDTO'
import { Appearance } from '@modules/persons/infra/mongoose/entities/Appearance'
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
  appearance: ICreateGenericObjectDTO
}

interface IResponse {
  person: IPersonMongo
  project: IProjectMongo
}

@injectable()
export class CreateAppearanceUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute({
    appearance,
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

    const appearanceExistesToThiPerson = person.appearance.find(
      (a) => a.title === appearance.title,
    )

    if (appearanceExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe uma aparência com esse nome.',
        message:
          'Já existe uma aparência com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

    const tagAppearances = project.tags.find(
      (tag) => tag.type === 'persons/appearance',
    )

    const appearanceAlreadyExistsInTags = tagAppearances?.refs.find(
      (ref) => ref.object.title === appearance.title,
    )
    if (appearanceAlreadyExistsInTags) {
      throw new AppError({
        title: 'Aparência já existe nas tags.',
        message:
          'Você já criou uma característica de aparência com esse nome para outro personagem... Caso a característica de aparência seja a mesma, tente atribui-la ao personagem, ou então escolha outro nome para a característica de aparência.',
        statusCode: 409,
      })
    }

    const newAppearance = new Appearance({
      title: appearance.title,
      description: appearance.description,
    })

    const updatedAppearances = [newAppearance, ...person.appearance]
    const updatedPerson = await this.personsRepository.updateAppearance(
      personId,
      updatedAppearances,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/appearance',
      [newAppearance],
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
