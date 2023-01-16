import { container, inject, injectable } from 'tsyringe'

import { IDream } from '@modules/persons/infra/mongoose/entities/Dream'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { ITag } from '@modules/projects/infra/mongoose/entities/Tag'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class ReferenceDreamUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute(
    userId: string,
    projectId: string,
    personId: string,
    refId: string,
  ): Promise<IPersonMongo> {
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
      projectId,
      'edit',
    )

    let tags: ITag[]
    tags = project.tags.filter((tag) => tag.type !== 'persons/dreams')
    const tagDreams = project.tags.find((tag) => tag.type === 'persons/dreams')

    if (!tagDreams) {
      throw new AppError({
        title: 'Tag inexistente',
        message: 'Você está tentando referenciar uma tag que não existe...',
        statusCode: 404,
      })
    }

    const exiteRef = tagDreams.refs.find((ref) => ref.object.id === refId)

    if (!exiteRef) {
      throw new AppError({
        title: 'Referência inexistente',
        message: 'Essa referencia não existe... Tente cria-lá',
        statusCode: 404,
      })
    }

    const personExisteInRef = exiteRef.references.find((id) => id === personId)

    if (personExisteInRef) {
      throw new AppError({
        title: 'Referencia criada anteriormente.',
        message: 'Esse personagem já foi adicionado a referencia',
        statusCode: 409,
      })
    }

    const addPersonToRef = {
      ...exiteRef,
      references: [...exiteRef.references, personId],
    }

    const filteredRefs = tagDreams.refs.filter((ref) => ref.object.id !== refId)

    const updatedTag: ITag = {
      ...tagDreams,
      refs: [addPersonToRef, ...filteredRefs],
    }

    tags = [updatedTag, ...tags]

    await this.projectsRepository.updateTag(projectId, tags)

    const dreamToIndexOnPerson: IDream = {
      id: exiteRef.object.id || '',
      title: exiteRef.object.title || '',
      description: exiteRef.object.description || '',
    }

    const updatedObjetives = [...person.dreams, dreamToIndexOnPerson]

    const updatedPerson = await this.personsRepository.updateDreams(
      personId,
      updatedObjetives,
    )

    return updatedPerson
  }
}
