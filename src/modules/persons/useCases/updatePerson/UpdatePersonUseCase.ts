import { inject, injectable } from 'tsyringe'

import { ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class UpdatePersonUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
  ) {}

  async execute(
    userId: string,
    personId: string,
    person: ICreatePersonDTO,
  ): Promise<IPersonMongo> {
    const personExite = await this.personsRepository.findById(personId)

    if (!personExite) {
      throw new AppError('O personagem não exite', 404)
    }

    if (personExite.fromUser !== userId) {
      throw new AppError(
        'Você não tem permissão para alterar esse personagem',
        404,
      )
    }

    const updatedPerson = await this.personsRepository.updatePerson(
      personId,
      person,
    )

    return updatedPerson
  }
}
