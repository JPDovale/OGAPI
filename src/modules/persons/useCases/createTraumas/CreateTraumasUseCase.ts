import { container, inject, injectable } from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import {
  ITrauma,
  Trauma,
} from '@modules/persons/infra/mongoose/entities/Trauma'
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
export class CreateTraumaUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute(
    trauma: ITrauma[],
    userId: string,
    projectId: string,
    personId: string,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw new AppError('O personagem não existe.', 404)

    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project } = await permissionToEditProject.verify(
      userId,
      projectId || person.defaultProject,
      'edit',
    )

    const errors: IError[] = []

    const unExitesTraumaToThisPerson = trauma.filter((p) => {
      const existeTrauma = person.traumas.find((obj) => obj.title === p.title)

      if (existeTrauma) {
        errors.push({
          at: p.title,
          errorMessage:
            'já exite um trauma com o mesmo nome para esse personagem',
        })

        return false
      } else return true
    })

    const tagTrauma = project.tags.find((tag) => tag.type === 'persons/traumas')

    const unExitesTrauma = tagTrauma
      ? unExitesTraumaToThisPerson.filter((p) => {
          const existeRef = tagTrauma.refs.find(
            (ref) => ref.object.title === p.title,
          )

          if (existeRef) {
            errors.push({
              at: p.title,
              errorMessage:
                'Você já criou um trauma com esse nome para outro personagem... Caso o trauma seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para o trauma.',
            })

            return false
          } else return true
        })
      : unExitesTraumaToThisPerson

    const newTrauma = unExitesTrauma.map((trauma) => {
      const newTrauma = new Trauma({
        title: trauma.title,
        consequences: trauma.consequences,
        description: trauma.description,
      })

      return { ...newTrauma }
    })

    const updateTraumas = [...newTrauma, ...person.traumas]
    const updatedPerson = await this.personsRepository.updateTraumas(
      personId,
      updateTraumas,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/traumas',
      newTrauma,
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
