import { container, inject, injectable } from 'tsyringe'

import { IUpdatePersonalityDTO } from '@modules/persons/dtos/IUpdatePersonalityDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonality } from '@modules/persons/infra/mongoose/entities/Personality'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { TagsToProject } from '@modules/projects/services/tags/TagsToProject'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class UpdatePersonalityUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectRepository: IProjectsRepository,
  ) {}

  async execute(
    userId: string,
    personId: string,
    personalityId: string,
    personality: IUpdatePersonalityDTO,
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

    const filteredPersonality = person.personality.filter(
      (personality) => personality.id !== personalityId,
    )
    const personalityToUpdate = person.personality.find(
      (personality) => personality.id === personalityId,
    )

    const updatedPersonality: IPersonality = {
      ...personalityToUpdate,
      ...personality,
    }

    const updatePersonality = [...filteredPersonality, updatedPersonality]

    const updatedPerson = await this.personsRepository.updatePersonality(
      personId,
      updatePersonality,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.updatePersonsTagsObject(
      'persons/personality',
      personalityId,
      personality,
      project.tags,
    )

    await this.projectRepository.updateTag(project.id, tags)

    return updatedPerson
  }
}
