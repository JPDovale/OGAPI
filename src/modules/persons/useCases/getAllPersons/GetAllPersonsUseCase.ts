import { inject, injectable } from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'

@injectable()
export class GetAllPersonsUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
  ) {}

  async execute(userId: string): Promise<IPersonMongo[]> {
    const allPersonsThisUser = await this.personsRepository.getAllPerUser(
      userId,
    )
    return allPersonsThisUser
  }
}
