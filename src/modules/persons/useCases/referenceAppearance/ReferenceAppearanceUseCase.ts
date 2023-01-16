import { container, inject, injectable } from 'tsyringe'

import { IAppearance } from '@modules/persons/infra/mongoose/entities/Appearance'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { ITag } from '@modules/projects/infra/mongoose/entities/Tag'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class ReferenceAppearanceUseCase {
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
      throw new AppError('O personagem não existe', 404)
    }

    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project } = await permissionToEditProject.verify(
      userId,
      projectId,
      'edit',
    )

    let tags: ITag[]
    tags = project.tags.filter((tag) => tag.type !== 'persons/appearance')
    const tagAppearances = project.tags.find(
      (tag) => tag.type === 'persons/appearance',
    ) as ITag

    if (!tagAppearances) {
      throw new AppError(
        'Você está tentando referenciar uma tag que não existe...',
        401,
      )
    }

    const exiteRef = tagAppearances.refs.find((ref) => ref.object.id === refId)

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

    const filteredRefs = tagAppearances.refs.filter(
      (ref) => ref.object.id !== refId,
    )

    const updatedTag: ITag = {
      ...tagAppearances,
      refs: [addPersonToRef, ...filteredRefs],
    }

    tags = [updatedTag, ...tags]

    await this.projectsRepository.updateTag(projectId, tags)

    const appearanceToIndexOnPerson: IAppearance = {
      id: exiteRef.object.id || '',
      title: exiteRef.object.title || '',
      description: exiteRef.object.description || '',
    }

    const updatedObjetives = [...person.appearance, appearanceToIndexOnPerson]

    const updatedPerson = await this.personsRepository.updateAppearance(
      personId,
      updatedObjetives,
    )

    return updatedPerson
  }
}
