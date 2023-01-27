import { container, inject, injectable } from 'tsyringe'

import { ICreateGenericObjectDTO } from '@modules/persons/dtos/ICreateGenericObjectDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { Wishe } from '@modules/persons/infra/mongoose/entities/Wishe'
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
  wishe: ICreateGenericObjectDTO
}

interface IResponse {
  person: IPersonMongo
  project: IProjectMongo
}

@injectable()
export class CreateWisheUseCase {
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
    wishe,
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

    const wisheExistesToThiPerson = person.wishes.find(
      (w) => w.title === wishe.title,
    )
    if (wisheExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe um desejo com esse nome.',
        message:
          'Já existe um desejo com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

    const tagWishes = project.tags.find((tag) => tag.type === 'persons/wishes')

    const wisheAlreadyExistsInTags = tagWishes?.refs.find(
      (ref) => ref.object.title === wishe.title,
    )
    if (wisheAlreadyExistsInTags) {
      throw new AppError({
        title: 'Desejo já existe nas tags.',
        message:
          'Você já criou um desejo com esse nome para outro personagem... Caso o desejo seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para o desejo.',
        statusCode: 409,
      })
    }

    const newWishe = new Wishe({
      description: wishe.description,
      title: wishe.title,
    })

    const updatedWishes = [newWishe, ...person.wishes]
    const updatedPerson = await this.personsRepository.updateWishes(
      personId,
      updatedWishes,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/wishes',
      [newWishe],
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
