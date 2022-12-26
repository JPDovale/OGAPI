import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class DeletePersonUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
  ) {}

  async execute(userId: string, personId: string): Promise<void> {
    const person = await this.personsRepository.findById(personId)

    if (!person) {
      throw new AppError('O personagem não existe', 404)
    }

    if (person.fromUser !== userId) {
      throw new AppError(
        'Você não tem permissão para apagar esse personagem, pois ele pertence a outro usuário',
        404,
      )
    }

    await this.personsRepository.deleteById(personId)
  }
}
