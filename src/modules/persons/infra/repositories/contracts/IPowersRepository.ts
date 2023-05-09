import { type ICreatePowerDTO } from '@modules/persons/dtos/ICreatePowerDTO'
import { type IUpdatePowerDTO } from '@modules/persons/dtos/IUpdatePowerDTO'

import { type IPower } from '../entities/IPower'
import { type IAddOnePersonInObject } from '../types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../types/IRemoveOnePersonById'

export abstract class IPowersRepository {
  abstract create(
    data: ICreatePowerDTO,
    personId: string,
  ): Promise<IPower | null>
  abstract findById(powerId: string): Promise<IPower | null>
  abstract delete(powerId: string): Promise<void>
  abstract removeOnePersonById(data: IRemoveOnePersonById): Promise<void>
  abstract addPerson(data: IAddOnePersonInObject): Promise<void>
  abstract update(data: IUpdatePowerDTO): Promise<IPower | null>
  abstract listPerPersons(personsIds: string[]): Promise<IPower[]>
}
