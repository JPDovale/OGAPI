import { container, inject, injectable } from 'tsyringe'

import { IReferencePersonalityDTO } from '@modules/persons/dtos/IReferencePersonalityDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonality } from '@modules/persons/infra/mongoose/entities/Personality'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { ITag } from '@modules/projects/infra/mongoose/entities/Tag'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class ReferencePersonalityUseCase {
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
    personality: IReferencePersonalityDTO,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    if (!person) {
      throw new AppError('O personagem não existe', 404)
    }

    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project } = await permissionToEditProject.verify(
      userId,
      projectId,
      'edit',
    )

    let tags: ITag[]
    tags = project.tags.filter((tag) => tag.type !== 'persons/personality')
    const tagPersonality = project.tags.find(
      (tag) => tag.type === 'persons/personality',
    ) as ITag

    if (!tagPersonality) {
      throw new AppError(
        'Você está tentando referenciar uma tag que não existe...',
        401,
      )
    }

    const exiteRef = tagPersonality.refs.find((ref) => ref.object.id === refId)

    if (!exiteRef) {
      throw new AppError('Essa referencia não existe... Tente cria-lá', 401)
    }

    const personExisteInRef = exiteRef.references.find((id) => id === personId)

    if (personExisteInRef) {
      throw new AppError('Esse personagem já foi adicionado a referencia', 401)
    }

    const addPersonToRef = {
      ...exiteRef,
      references: [...exiteRef.references, personId],
    }

    const filteredRefs = tagPersonality.refs.filter(
      (ref) => ref.object.id !== refId,
    )

    const updatedTag: ITag = {
      ...tagPersonality,
      refs: [addPersonToRef, ...filteredRefs],
    }

    tags = [updatedTag, ...tags]

    await this.projectsRepository.updateTag(projectId, tags)

    const personalityToIndexOnPerson: IPersonality = {
      id: exiteRef.object.id || '',
      title: exiteRef.object.title || '',
      description: exiteRef.object.description || '',
      consequences: personality.consequences,
    }

    const updatedPersonality = [
      ...person.personality,
      personalityToIndexOnPerson,
    ]

    const updatedPerson = await this.personsRepository.updatePersonality(
      personId,
      updatedPersonality,
    )

    return updatedPerson
  }
}
