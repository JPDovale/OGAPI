import { type ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { type IUpdatePersonDTO } from '@modules/persons/dtos/IUpdatePersonDTO'

import { type IPerson } from '../entities/IPerson'

export abstract class IPersonsRepository {
  abstract create(data: ICreatePersonDTO): Promise<IPerson | null>
  abstract findById(personId: string): Promise<IPerson | null>
  abstract updatePerson(data: IUpdatePersonDTO): Promise<IPerson | null>
  abstract delete(personId: string): Promise<void>
  abstract deletePerProjectId(projectId: string): Promise<void>

  // TEMPORARY
  abstract listAll(): Promise<IPerson[]>
}
