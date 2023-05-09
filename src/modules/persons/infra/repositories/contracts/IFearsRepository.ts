import { type ICreateFearDTO } from '@modules/persons/dtos/ICreateFearDTO'
import { type IUpdateFearDTO } from '@modules/persons/dtos/IUpdateFearDTO'

import { type IFear } from '../entities/IFear'
import { type IAddOnePersonInObject } from '../types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../types/IRemoveOnePersonById'

export abstract class IFearsRepository {
  abstract create(data: ICreateFearDTO, personId: string): Promise<IFear | null>
  abstract findById(fearId: string): Promise<IFear | null>
  abstract delete(fearId: string): Promise<void>
  abstract removeOnePersonById(data: IRemoveOnePersonById): Promise<void>
  abstract addPerson(data: IAddOnePersonInObject): Promise<void>
  abstract update(data: IUpdateFearDTO): Promise<IFear | null>
  abstract listPerPersons(personsIds: string[]): Promise<IFear[]>
}
