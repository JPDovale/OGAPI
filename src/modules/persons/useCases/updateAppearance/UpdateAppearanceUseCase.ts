import { container, inject, injectable } from 'tsyringe'

import { IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'
import { IAppearance } from '@modules/persons/infra/mongoose/entities/Appearance'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { TagsToProject } from '@modules/projects/services/tags/TagsToProject'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class UpdateAppearanceUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectRepository: IProjectsRepository,
  ) {}

  async execute(
    userId: string,
    personId: string,
    appearanceId: string,
    appearance: IUpdateBaseDTO,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)
    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project, permission } = await permissionToEditProject.verify(
      userId,
      person.defaultProject,
      'edit',
    )

    if (!person) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Você está tentando atualizar um personagem que não existe.',
        statusCode: 404,
      })
    }

    if (permission !== 'edit') {
      throw new AppError({
        title: 'Você não tem permissão para atualizar o personagem',
        message: 'Você está tentando atualizar um personagem que não existe.',
        statusCode: 401,
      })
    }

    const filteredAppearances = person.appearance.filter(
      (appearance) => appearance.id !== appearanceId,
    )
    const appearanceToUpdate = person.appearance.find(
      (appearance) => appearance.id === appearanceId,
    )

    const updatedAppearance: IAppearance = {
      ...appearanceToUpdate,
      ...appearance,
    }

    const updatedAppearances = [...filteredAppearances, updatedAppearance]

    const updatedPerson = await this.personsRepository.updateAppearance(
      personId,
      updatedAppearances,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.updatePersonsTagsObject(
      'persons/appearance',
      appearanceId,
      { title: appearance.title, description: appearance.description },
      project.tags,
    )

    await this.projectRepository.updateTag(project.id, tags)

    return updatedPerson
  }
}
