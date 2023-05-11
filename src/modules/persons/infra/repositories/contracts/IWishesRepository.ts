import { type ICreateWisheDTO } from '@modules/persons/dtos/ICreateWisheDTO'
import { type IUpdateWisheDTO } from '@modules/persons/dtos/IUpdateWisheDTO'

import { type IWishe } from '../entities/IWishe'
import { type IAddOnePersonInObject } from '../types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../types/IRemoveOnePersonById'

export abstract class IWishesRepository {
  abstract create(
    data: ICreateWisheDTO,
    personId: string,
  ): Promise<IWishe | null>
  abstract findById(wisheId: string): Promise<IWishe | null>
  abstract delete(wisheId: string): Promise<void>
  abstract removeOnePersonById(data: IRemoveOnePersonById): Promise<void>
  abstract addPerson(data: IAddOnePersonInObject): Promise<void>
  abstract update(data: IUpdateWisheDTO): Promise<IWishe | null>
  abstract listPerPersons(personIds: string[]): Promise<IWishe[]>
}
