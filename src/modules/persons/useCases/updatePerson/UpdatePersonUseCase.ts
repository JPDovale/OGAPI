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
      throw new AppError({
        title: 'Personagem não encontrado.',
        message:
          'Parece que esse personagem não existe na nossa base de dados...',
        statusCode: 404,
      })
    }

    if (personExite.fromUser !== userId) {
      throw new AppError({
        title: 'Acesso negado!',
        message: 'Você não tem permissão para alterar o projeto.',
        statusCode: 401,
      })
    }

    const updatedPerson = await this.personsRepository.updatePerson(
      personId,
      person,
    )

    return updatedPerson
  }
}
