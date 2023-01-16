import { container, inject, injectable } from 'tsyringe'

import { IReferenceTraumaDTO } from '@modules/persons/dtos/IReferenceTraumaDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { ITrauma } from '@modules/persons/infra/mongoose/entities/Trauma'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { ITag } from '@modules/projects/infra/mongoose/entities/Tag'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class ReferenceTraumaUseCase {
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
    trauma: IReferenceTraumaDTO,
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
    tags = project.tags.filter((tag) => tag.type !== 'persons/traumas')
    const tagTrauma = project.tags.find((tag) => tag.type === 'persons/traumas')

    if (!tagTrauma) {
      throw new AppError({
        title: 'Tag inexistente',
        message: 'Você está tentando referenciar uma tag que não existe...',
        statusCode: 404,
      })
    }

    const exiteRef = tagTrauma.refs.find((ref) => ref.object.id === refId)

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

    const filteredRefs = tagTrauma.refs.filter((ref) => ref.object.id !== refId)

    const updatedTag: ITag = {
      ...tagTrauma,
      refs: [addPersonToRef, ...filteredRefs],
    }

    tags = [updatedTag, ...tags]

    await this.projectsRepository.updateTag(projectId, tags)

    const traumaToIndexOnPerson: ITrauma = {
      id: exiteRef.object.id || '',
      title: exiteRef.object.title || '',
      description: exiteRef.object.description || '',
      consequences: trauma.consequences,
    }

    const updatedTrauma = [...person.traumas, traumaToIndexOnPerson]

    const updatedPerson = await this.personsRepository.updateTraumas(
      personId,
      updatedTrauma,
    )

    return updatedPerson
  }
}
