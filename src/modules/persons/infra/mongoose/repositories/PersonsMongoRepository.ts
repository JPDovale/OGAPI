import { type IUpdatePersonDTO } from '@modules/persons/dtos/IUpdatePersonDTO'
import { type Prisma } from '@prisma/client'

import { type IPersonsRepository } from '../../repositories/contracts/IPersonsRepository'
import { type IPerson } from '../../repositories/entities/IPerson'
import { type IUpdateImage } from '../../repositories/types/IUpdateImage'
import { PersonMongo } from '../entities/Person'

export class PersonsMongoRepository implements IPersonsRepository {
  async delete(personId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async create(
    data: Prisma.PersonUncheckedCreateInput,
  ): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async findById(personId: string): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async updateImage(data: IUpdateImage): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async updatePerson(data: IUpdatePersonDTO): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async listAll(): Promise<IPerson[]> {
    const persons = await PersonMongo.find()
    return persons as unknown as IPerson[]
  }
}
