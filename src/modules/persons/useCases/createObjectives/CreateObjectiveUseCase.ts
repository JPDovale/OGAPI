import { container, inject, injectable } from 'tsyringe'

import {
  IObjective,
  Objective,
} from '@modules/persons/infra/mongoose/entities/Objective'
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
export class CreateObjectiveUseCase {
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
    objectives: IObjective[],
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

    const unExitesObjectivesToThisPerson = objectives.filter((objective) => {
      const existeObjective = person.objectives.find(
        (obj) => obj.title === objective.title,
      )

      if (existeObjective) {
        errors.push({
          at: objective.title,
          errorMessage:
            'já exite um objetivo com o mesmo nome para esse personagem',
        })

        return false
      } else return true
    })

    const tagObjectives = project.tags.find(
      (tag) => tag.type === 'persons/objectives',
    )

    const unExitesObjectives = tagObjectives
      ? unExitesObjectivesToThisPerson.filter((objective) => {
          const existeRef = tagObjectives.refs.find(
            (ref) => ref.object.title === objective.title,
          )

          if (existeRef) {
            errors.push({
              at: objective.title,
              errorMessage:
                'Você já criou um objetivo com esse nome para outro personagem... Caso o objetivo seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para o objetivo.',
            })

            return false
          } else return true
        })
      : unExitesObjectivesToThisPerson

    const newObjectives = unExitesObjectives.map((objective) => {
      const newObjective = new Objective({
        avoiders: objective.avoiders,
        description: objective.description,
        objectified: objective.objectified,
        supporting: objective.supporting,
        title: objective.title,
      })

      return { ...newObjective }
    })

    const updatedObjetives = [...newObjectives, ...person.objectives]
    const updatedPerson = await this.personsRepository.updateObjectives(
      personId,
      updatedObjetives,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/objectives',
      newObjectives,
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
