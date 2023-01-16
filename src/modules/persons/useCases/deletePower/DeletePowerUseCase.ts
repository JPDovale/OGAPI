import { container, inject, injectable } from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { TagsToProject } from '@modules/projects/services/tags/TagsToProject'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class DeletePowerUseCase {
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
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)
    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project } = await permissionToEditProject.verify(
      userId,
      person.defaultProject,
      'edit',
    )

    if (!person) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Parece que esse personagem não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    if (person.fromUser !== userId) {
      throw new AppError({
        title: 'Permissão de alteração invalida.',
        message:
          'Você não tem permissão para apagar esse personagem, pois ele pertence a outro usuário',
        statusCode: 401,
      })
    }

    const filteredPowers = person.powers.filter((power) => power.id !== powerId)

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.deleteReferenceTag(
      'persons/powers',
      powerId,
      personId,
      project.tags,
    )

    await this.projectRepository.updateTag(project.id, tags)

    const updatePerson = await this.personsRepository.updatePowers(
      personId,
      filteredPowers,
    )
    return updatePerson
  }
}
