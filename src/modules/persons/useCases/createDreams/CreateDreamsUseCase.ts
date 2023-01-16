import { container, inject, injectable } from 'tsyringe'

import { IDream, Dream } from '@modules/persons/infra/mongoose/entities/Dream'
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
export class CreateDreamUseCase {
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
    dreams: IDream[],
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

    const unExitesDreamsToThisPerson = dreams.filter((dream) => {
      const existeDream = person.dreams.find((obj) => obj.title === dream.title)

      if (existeDream) {
        errors.push({
          at: dream.title,
          errorMessage:
            'já exite um "sonho" com o mesmo nome para esse personagem',
        })

        return false
      } else return true
    })

    const tagDreams = project.tags.find((tag) => tag.type === 'persons/dreams')

    const unExitesDreams = tagDreams
      ? unExitesDreamsToThisPerson.filter((dream) => {
          const existeRef = tagDreams.refs.find(
            (ref) => ref.object.title === dream.title,
          )

          if (existeRef) {
            errors.push({
              at: dream.title,
              errorMessage:
                'Você já criou um sonho com esse nome para outro personagem... Caso o sonho seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para o sonho.',
            })

            return false
          } else return true
        })
      : unExitesDreamsToThisPerson

    const newDreams = unExitesDreams.map((dream) => {
      const newDream = new Dream({
        description: dream.description,
        title: dream.title,
      })

      return { ...newDream }
    })

    const updatedDreams = [...newDreams, ...person.dreams]
    const updatedPerson = await this.personsRepository.updateDreams(
      personId,
      updatedDreams,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/dreams',
      newDreams,
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
