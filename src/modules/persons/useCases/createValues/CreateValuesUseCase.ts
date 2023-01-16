import { container, inject, injectable } from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IValue, Value } from '@modules/persons/infra/mongoose/entities/Value'
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
export class CreateValueUseCase {
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
    values: IValue[],
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    if (!person) {
      throw new AppError('O personagem não existe', 404)
    }

    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project } = await permissionToEditProject.verify(
      userId,
      projectId || person.defaultProject,
      'edit',
    )

    const errors: IError[] = []

    const unExitesValuesToThisPerson = values.filter((value) => {
      const existeValue = person.values.find((obj) => obj.title === value.title)

      if (existeValue) {
        errors.push({
          at: value.title,
          errorMessage:
            'já exite um "valor" com o mesmo nome para esse personagem',
        })

        return false
      } else return true
    })

    const tagValues = project.tags.find((tag) => tag.type === 'persons/values')

    const unExitesValues = tagValues
      ? unExitesValuesToThisPerson.filter((value) => {
          const existeRef = tagValues.refs.find(
            (ref) => ref.object.title === value.title,
          )

          if (existeRef) {
            errors.push({
              at: value.title,
              errorMessage:
                'Você já criou um objetivo com esse nome para outro personagem... Caso o objetivo seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para o objetivo.',
            })

            return false
          } else return true
        })
      : unExitesValuesToThisPerson

    const newValues = unExitesValues.map((value) => {
      const newValue = new Value({
        description: value.description,
        title: value.title,
        exceptions: value.exceptions,
      })

      return { ...newValue }
    })

    const updatedObjetives = [...newValues, ...person.values]
    const updatedPerson = await this.personsRepository.updateValues(
      personId,
      updatedObjetives,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/values',
      newValues,
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
