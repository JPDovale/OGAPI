import { type ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { type IUpdatePersonDTO } from '@modules/persons/dtos/IUpdatePersonDTO'

import { type IPersonsRepository } from '../contracts/IPersonsRepository'
import { type IPerson } from '../entities/IPerson'
import { type IUpdateImage } from '../types/IUpdateImage'

export class PersonsRepositoryInMemory implements IPersonsRepository {
  persons: IPerson[] = []

  async create(data: ICreatePersonDTO): Promise<IPerson | null> {
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

  async delete(personId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async listAll(): Promise<IPerson[]> {
    throw new Error('Method not implemented.')
  }
}
