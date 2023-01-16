import { container, inject, injectable } from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IWishe, Wishe } from '@modules/persons/infra/mongoose/entities/Wishe'
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
export class CreateWisheUseCase {
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
    wishes: IWishe[],
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

    const unExitesWishesToThisPerson = wishes.filter((wishe) => {
      const existeWishe = person.wishes.find((obj) => obj.title === wishe.title)

      if (existeWishe) {
        errors.push({
          at: wishe.title,
          errorMessage:
            'já exite um "desejo" com o mesmo nome para esse personagem',
        })

        return false
      } else return true
    })

    const tagWishes = project.tags.find((tag) => tag.type === 'persons/wishes')

    const unExitesWishes = tagWishes
      ? unExitesWishesToThisPerson.filter((wishe) => {
          const existeRef = tagWishes.refs.find(
            (ref) => ref.object.title === wishe.title,
          )

          if (existeRef) {
            errors.push({
              at: wishe.title,
              errorMessage:
                'Você já criou um desejo com esse nome para outro personagem... Caso o desejo seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para o desejo.',
            })

            return false
          } else return true
        })
      : unExitesWishesToThisPerson

    const newWishes = unExitesWishes.map((wishe) => {
      const newWishe = new Wishe({
        description: wishe.description,
        title: wishe.title,
      })

      return { ...newWishe }
    })

    const updatedWishes = [...newWishes, ...person.wishes]
    const updatedPerson = await this.personsRepository.updateWishes(
      personId,
      updatedWishes,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/wishes',
      newWishes,
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
