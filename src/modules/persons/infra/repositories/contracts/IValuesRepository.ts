import { type ICreateValueDTO } from '@modules/persons/dtos/ICreateValueDTO'
import { type IUpdateValueDTO } from '@modules/persons/dtos/IUpdateValueDTO'

import { type IValue } from '../entities/IValue'
import { type IAddOnePersonInObject } from '../types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../types/IRemoveOnePersonById'

export abstract class IValuesRepository {
  abstract create(data: ICreateValueDTO): Promise<IValue | null>
  abstract findById(valueId: string): Promise<IValue | null>
  abstract delete(valueId: string): Promise<void>
  abstract removeOnePersonById(data: IRemoveOnePersonById): Promise<void>
  abstract addPerson(data: IAddOnePersonInObject): Promise<void>
  abstract update(data: IUpdateValueDTO): Promise<IValue | null>
}
