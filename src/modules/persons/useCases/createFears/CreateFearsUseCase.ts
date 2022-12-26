import { container, inject, injectable } from 'tsyringe'

import { IFear, Fear } from '@modules/persons/infra/mongoose/entities/Fear'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { TagsToProject } from '@modules/projects/services/tags/TagsToProject'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

interface IError {
  at: string
  message: string
}

interface IResponse {
  updatedPerson: IPersonMongo
  errors?: IError[]
}

@injectable()
export class CreateFearUseCase {
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
    fears: IFear[],
  ): Promise<IResponse> {
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

    const unExitesFearsToThisPerson = fears.filter((fear) => {
      const existeFear = person.fears.find((obj) => obj.title === fear.title)

      if (existeFear) {
        errors.push({
          at: fear.title,
          message: 'já exite um "medo" com o mesmo nome para esse personagem',
        })

        return false
      } else return true
    })

    const tagFears = project.tags.find((tag) => tag.type === 'persons/fears')

    const unExitesFears = tagFears
      ? unExitesFearsToThisPerson.filter((fear) => {
          const existeRef = tagFears.refs.find(
            (ref) => ref.object.title === fear.title,
          )

          if (existeRef) {
            errors.push({
              at: fear.title,
              message:
                'Você já criou um medo com esse nome para outro personagem... Caso o medo seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para o medo.',
            })

            return false
          } else return true
        })
      : unExitesFearsToThisPerson

    const newFears = unExitesFears.map((fear) => {
      const newFear = new Fear({
        description: fear.description,
        title: fear.title,
      })

      return { ...newFear }
    })

    const updatedFears = [...newFears, ...person.fears]
    const updatedPerson = await this.personsRepository.updateFears(
      personId,
      updatedFears,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/fears',
      newFears,
      [personId],
      project.name,
    )

    await this.projectsRepository.updateTag(
      projectId || person.defaultProject,
      tags,
    )

    return { updatedPerson, errors }
  }
}
