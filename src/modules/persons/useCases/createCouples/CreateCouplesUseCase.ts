import {
  // container,
  inject,
  injectable,
} from 'tsyringe'

import {
  ICouple,
  Couple,
} from '@modules/persons/infra/mongoose/entities/Couple'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
// import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
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
export class CreateCoupleUseCase {
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
    couples: ICouple[],
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    if (!person) {
      throw new AppError('O personagem não existe', 404)
    }

    // const permissionToEditProject = container.resolve(PermissionToEditProject)
    // const { project } = await permissionToEditProject.verify(
    //   userId,
    //   projectId || person.defaultProject,
    //   'edit',
    // )

    const errors: IError[] = []

    const unExitesCouplesToThisPerson = couples.filter((couple) => {
      const existeCouple = person.couples.find(
        (obj) => obj.title === couple.title,
      )

      if (existeCouple) {
        errors.push({
          at: couple.title,
          errorMessage:
            'já exite um "medo" com o mesmo nome para esse personagem',
        })

        return false
      } else return true
    })

    const newCouples = unExitesCouplesToThisPerson.map((couple) => {
      const newCouple = new Couple({
        description: couple.description,
        title: couple.title,
        final: couple.final,
        personId: couple.personId,
      })

      return { ...newCouple }
    })

    const updatedCouples = [...newCouples, ...person.couples]
    const updatedPerson = await this.personsRepository.updateCouples(
      personId,
      updatedCouples,
    )

    return updatedPerson
  }
}
