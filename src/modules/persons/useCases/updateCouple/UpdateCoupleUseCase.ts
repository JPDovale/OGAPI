import {
  // container,
  inject,
  injectable,
} from 'tsyringe'

import { IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'
import { ICouple } from '@modules/persons/infra/mongoose/entities/Couple'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
// import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class UpdateCoupleUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
  ) {}

  async execute(
    userId: string,
    personId: string,
    coupleId: string,
    couple: IUpdateBaseDTO,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)
    // const permissionToEditProject = container.resolve(PermissionToEditProject)
    // const { project } = await permissionToEditProject.verify(
    //   userId,
    //   person.defaultProject,
    //   'edit',
    // )

    if (!person) {
      throw new AppError('O personagem não existe', 404)
    }

    if (person.fromUser !== userId) {
      throw new AppError(
        'Você não tem permissão para apagar esse personagem, pois ele pertence a outro usuário',
        404,
      )
    }

    const filteredCouples = person.couples.filter(
      (couple) => couple.id !== coupleId,
    )
    const coupleToUpdate = person.couples.find(
      (couple) => couple.id === coupleId,
    )

    const updatedCouple: ICouple = {
      ...coupleToUpdate,
      ...couple,
    }

    const updatedCouples = [...filteredCouples, updatedCouple]

    const updatedPerson = await this.personsRepository.updateCouples(
      personId,
      updatedCouples,
    )

    return updatedPerson
  }
}
