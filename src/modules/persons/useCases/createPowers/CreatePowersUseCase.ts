import { container, inject, injectable } from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPower, Power } from '@modules/persons/infra/mongoose/entities/Power'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { TagsToProject } from '@modules/projects/services/tags/TagsToProject'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

interface IError {
  at: string
  errorMessage: string
}

// interface IResponse {
//   updatedPerson: IPersonMongo
//   errors?: IError[]
// }

@injectable()
export class CreatePowerUseCase {
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
    powers: IPower[],
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
      projectId || person.defaultProject,
      'edit',
    )

    const errors: IError[] = []

    const unExitesPowersToThisPerson = powers.filter((power) => {
      const existePower = person.powers.find((obj) => obj.title === power.title)

      if (existePower) {
        errors.push({
          at: power.title,
          errorMessage:
            'já exite um "medo" com o mesmo nome para esse personagem',
        })

        return false
      } else return true
    })

    const tagPowers = project.tags.find((tag) => tag.type === 'persons/powers')

    const unExitesPowers = tagPowers
      ? unExitesPowersToThisPerson.filter((power) => {
          const existeRef = tagPowers.refs.find(
            (ref) => ref.object.title === power.title,
          )

          if (existeRef) {
            errors.push({
              at: power.title,
              errorMessage:
                'Você já criou um medo com esse nome para outro personagem... Caso o medo seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para o medo.',
            })

            return false
          } else return true
        })
      : unExitesPowersToThisPerson

    const newPowers = unExitesPowers.map((power) => {
      const newPower = new Power({
        description: power.description,
        title: power.title,
      })

      return { ...newPower }
    })

    const updatedPowers = [...newPowers, ...person.powers]
    const updatedPerson = await this.personsRepository.updatePowers(
      personId,
      updatedPowers,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/powers',
      newPowers,
      [personId],
      project.name,
    )

    await this.projectsRepository.updateTag(
      projectId || person.defaultProject,
      tags,
    )

    return updatedPerson
  }
}
