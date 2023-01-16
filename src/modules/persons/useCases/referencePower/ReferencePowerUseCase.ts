import { container, inject, injectable } from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPower } from '@modules/persons/infra/mongoose/entities/Power'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { ITag } from '@modules/projects/infra/mongoose/entities/Tag'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class ReferencePowerUseCase {
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
    tags = project.tags.filter((tag) => tag.type !== 'persons/powers')
    const tagPowers = project.tags.find(
      (tag) => tag.type === 'persons/powers',
    ) as ITag

    if (!tagPowers) {
      throw new AppError(
        'Você está tentando referenciar uma tag que não existe...',
        401,
      )
    }

    const exiteRef = tagPowers.refs.find((ref) => ref.object.id === refId)

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

    const filteredRefs = tagPowers.refs.filter((ref) => ref.object.id !== refId)

    const updatedTag: ITag = {
      ...tagPowers,
      refs: [addPersonToRef, ...filteredRefs],
    }

    tags = [updatedTag, ...tags]

    await this.projectsRepository.updateTag(projectId, tags)

    const fearToIndexOnPerson: IPower = {
      id: exiteRef.object.id || '',
      title: exiteRef.object.title || '',
      description: exiteRef.object.description || '',
    }

    const updatedPowers = [...person.powers, fearToIndexOnPerson]

    const updatedPerson = await this.personsRepository.updatePowers(
      personId,
      updatedPowers,
    )

    return updatedPerson
  }
}
