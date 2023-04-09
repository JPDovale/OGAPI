import { inject, injectable } from 'tsyringe'

import { type ICreateCoupleDTO } from '@modules/persons/dtos/ICreateCoupleDTO'
import { Couple } from '@modules/persons/infra/mongoose/entities/Couple'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'

interface IRequest {
  userId: string
  projectId: string
  personId: string
  couple: ICreateCoupleDTO
}

interface IResponse {
  person: IPersonMongo
  personOfCouple: IPersonMongo
}

@injectable()
export class CreateCoupleUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({
    userId,
    couple,
    personId,
    projectId,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)
    const personOfCouple = await this.personsRepository.findById(
      couple.personId,
    )

    if (!person || !personOfCouple) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: projectId ?? person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const coupleExisteToThisPerson = person.couples.find(
      (c) => c.personId === couple.personId,
    )
    const personOfCoupleExisteToThisPerson = personOfCouple?.couples.find(
      (c) => c.personId === personId,
    )

    if (coupleExisteToThisPerson ?? personOfCoupleExisteToThisPerson) {
      throw new AppError({
        title: 'Já existe uma casal relacionado a esse personagem.',
        message:
          'Já existe uma casal relacionado a esse personagem. Tente com outro personagem.',
      })
    }

    const newCouple = new Couple({
      description: couple.description,
      title: couple.title,
      final: couple.final,
      personId: couple.personId,
    })

    const newCoupleToPersonOfCouple = new Couple({
      description: couple.description,
      title: couple.title,
      final: couple.final,
      personId,
    })

    const updatedCouples = [newCouple, ...person.couples]
    const updatedPerson = await this.personsRepository.updateCouples(
      personId,
      updatedCouples,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    const updatedCoupleToPersonOfCouple = [
      newCoupleToPersonOfCouple,
      ...personOfCouple.couples,
    ]
    const updatedPersonOfCouple = await this.personsRepository.updateCouples(
      couple.personId,
      updatedCoupleToPersonOfCouple,
    )

    if (!updatedPersonOfCouple) {
      await this.personsRepository.updateCouples(personId, person.couples)
      throw makeErrorPersonNotUpdate()
    }

    return { person: updatedPerson, personOfCouple: updatedPersonOfCouple }
  }
}
