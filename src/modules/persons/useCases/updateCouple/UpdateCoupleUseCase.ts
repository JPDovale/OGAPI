import { container, inject, injectable } from 'tsyringe'

import { IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'
import { ICouple } from '@modules/persons/infra/mongoose/entities/Couple'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
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
    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { permission } = await permissionToEditProject.verify(
      userId,
      person.defaultProject,
      'edit',
    )

    if (!person) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Você está tentando atualizar um personagem que não existe.',
        statusCode: 404,
      })
    }

    if (permission !== 'edit') {
      throw new AppError({
        title: 'Você não tem permissão para atualizar o personagem',
        message: 'Você está tentando atualizar um personagem que não existe.',
        statusCode: 401,
      })
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
