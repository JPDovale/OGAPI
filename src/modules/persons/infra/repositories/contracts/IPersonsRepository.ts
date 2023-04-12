import { type ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { type IUpdatePersonDTO } from '@modules/persons/dtos/IUpdatePersonDTO'

import { type IPerson } from '../entities/IPerson'
import { type IUpdateImage } from '../types/IUpdateImage'

export abstract class IPersonsRepository {
  abstract create(data: ICreatePersonDTO): Promise<IPerson | null>
  abstract findById(personId: string): Promise<IPerson | null>
  abstract updateImage(data: IUpdateImage): Promise<IPerson | null>
  abstract updatePerson(data: IUpdatePersonDTO): Promise<IPerson | null>
  abstract delete(personId: string): Promise<void>

  // TEMPORARY
  abstract listAll(): Promise<IPerson[]>
}
