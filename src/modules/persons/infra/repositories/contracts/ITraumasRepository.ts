import { type ICreateTraumaDTO } from '@modules/persons/dtos/ICreateTraumaDTO'
import { type IUpdateTraumaDTO } from '@modules/persons/dtos/IUpdateTraumaDTO'

import { type ITrauma } from '../entities/ITrauma'
import { type IAddOnePersonInObject } from '../types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../types/IRemoveOnePersonById'

export abstract class ITraumasRepository {
  abstract create(
    data: ICreateTraumaDTO,
    personId: string,
  ): Promise<ITrauma | null>
  abstract findById(traumaId: string): Promise<ITrauma | null>
  abstract delete(traumaId: string): Promise<void>
  abstract removeOnePersonById(data: IRemoveOnePersonById): Promise<void>
  abstract addPerson(data: IAddOnePersonInObject): Promise<void>
  abstract update(data: IUpdateTraumaDTO): Promise<ITrauma | null>
  abstract listPerPersons(personsIds: string[]): Promise<ITrauma[]>
}
