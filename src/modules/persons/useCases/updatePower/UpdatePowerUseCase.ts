import { container, inject, injectable } from 'tsyringe'

import { IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPower } from '@modules/persons/infra/mongoose/entities/Power'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { TagsToProject } from '@modules/projects/services/tags/TagsToProject'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class UpdatePowerUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectRepository: IProjectsRepository,
  ) {}

  async execute(
    userId: string,
    personId: string,
    powerId: string,
    power: IUpdateBaseDTO,
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
    const filteredPowers = person.powers.filter((power) => power.id !== powerId)
    const powerToUpdate = person.powers.find((power) => power.id === powerId)

    const updatedPower: IPower = {
      ...powerToUpdate,
      ...power,
    }

    const updatedPowers = [...filteredPowers, updatedPower]

    const updatedPerson = await this.personsRepository.updatePowers(
      personId,
      updatedPowers,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.updatePersonsTagsObject(
      'persons/powers',
      powerId,
      { title: power.title, description: power.description },
      project.tags,
    )

    await this.projectRepository.updateTag(project.id, tags)

    return updatedPerson
  }
}
