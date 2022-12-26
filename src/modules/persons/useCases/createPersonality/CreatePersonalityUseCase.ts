import { container, inject, injectable } from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import {
  IPersonality,
  Personality,
} from '@modules/persons/infra/mongoose/entities/Personality'
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
export class CreatePersonalityUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute(
    personality: IPersonality[],
    userId: string,
    projectId: string,
    personId: string,
  ): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw new AppError('O personagem não existe.', 404)

    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project } = await permissionToEditProject.verify(
      userId,
      projectId || person.defaultProject,
      'edit',
    )

    const errors: IError[] = []

    const unExitesPersonalityToThisPerson = personality.filter((p) => {
      const existePersonality = person.personality.find(
        (obj) => obj.title === p.title,
      )

      if (existePersonality) {
        errors.push({
          at: p.title,
          message:
            'já exite uma característica de personalidade com o mesmo nome para esse personagem',
        })

        return false
      } else return true
    })

    const tagPersonality = project.tags.find(
      (tag) => tag.type === 'persons/personality',
    )

    const unExitesPersonality = tagPersonality
      ? unExitesPersonalityToThisPerson.filter((p) => {
          const existeRef = tagPersonality.refs.find(
            (ref) => ref.object.title === p.title,
          )

          if (existeRef) {
            errors.push({
              at: p.title,
              message:
                'Você já criou um objetivo com esse nome para outro personagem... Caso o objetivo seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome para o objetivo.',
            })

            return false
          } else return true
        })
      : unExitesPersonalityToThisPerson

    const newPersonality = unExitesPersonality.map((personality) => {
      const newPersonality = new Personality({
        title: personality.title,
        consequences: personality.consequences,
        description: personality.description,
      })

      return { ...newPersonality }
    })

    const updatePersonality = [...newPersonality, ...person.personality]
    const updatedPerson = await this.personsRepository.updatePersonality(
      personId,
      updatePersonality,
    )

    const tagsToProject = container.resolve(TagsToProject)
    const tags = await tagsToProject.createOrUpdate(
      project.tags,
      'persons/personality',
      newPersonality,
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
