import { container, inject, injectable } from 'tsyringe'

import {
  IAppearance,
  Appearance,
} from '@modules/persons/infra/mongoose/entities/Appearance'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
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
export class CreateAppearanceUseCase {
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
    appearance: IAppearance[],
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

    const unExitesAppearancesToThisPerson = appearance.filter((dream) => {
      const existeAppearance = person.appearance.find(
        (obj) => obj.title === dream.title,
      )

      if (existeAppearance) {
        errors.push({
          at: dream.title,
          errorMessage:
            'já exite uma"característica de aparência" com o mesmo nome para esse personagem',
        })

        return false
      } else return true
    })

    const tagAppearances = project.tags.find(
      (tag) => tag.type === 'persons/appearance',
    )

    const unExitesAppearances = tagAppearances
      ? unExitesAppearancesToThisPerson.filter((dream) => {
          const existeRef = tagAppearances.refs.find(
            (ref) => ref.object.title === dream.title,
          )

          if (existeRef) {
            errors.push({
              at: dream.title,
              errorMessage:
                'Você já criou uma característica de aparência com esse nome para outro personagem... Caso a característica de aparência seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para a característica de aparência.',
            })

            return false
          } else return true
        })
      : unExitesAppearancesToThisPerson

    const newAppearances = unExitesAppearances.map((dream) => {
      const newAppearance = new Appearance({
        description: dream.description,
        title: dream.title,
      })

      return { ...newAppearance }
    })

    const updatedAppearances = [...newAppearances, ...person.appearance]
    const updatedPerson = await this.personsRepository.updateAppearance(
      personId,
      updatedAppearances,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/appearance',
      newAppearances,
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
